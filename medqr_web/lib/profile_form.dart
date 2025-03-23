import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:intl/intl.dart';
import 'login_page.dart';
import 'qr_page.dart';

class ProfileForm extends StatefulWidget {
  const ProfileForm({super.key});

  @override
  State<ProfileForm> createState() => _ProfileFormState();
}

class _ProfileFormState extends State<ProfileForm> {
  final nameController = TextEditingController();
  final heightController = TextEditingController();
  final weightController = TextEditingController();
  final historyController = TextEditingController();
  final medicalController = TextEditingController();
  final allergyController = TextEditingController();
  final contactController = TextEditingController();

  DateTime? selectedDOB;
  String selectedBloodType = 'A+';
  String selectedSex = 'Prefer not to say';

  bool smokes = false;
  String cigarettesPerDay = '';
  bool drinksAlcohol = false;
  bool usesDrugs = false;

  final drugsController = TextEditingController();
  List<String> drugsList = [];

  List<String> medicalConditions = [];
  List<String> allergies = [];
  List<String> emergencyContacts = [];

  List<TextEditingController> medNameControllers = [];
  List<TextEditingController> medDosageControllers = [];
  List<List<String>> medDays = [];
  List<String> medTimes = [];

  @override
  void initState() {
    super.initState();
    loadProfile();
  }

  Future<void> loadProfile() async {
    final uid = FirebaseAuth.instance.currentUser!.uid;
    final doc =
        await FirebaseFirestore.instance.collection("Users").doc(uid).get();

    if (doc.exists) {
      final data = doc.data()!;
      nameController.text = data['name'] ?? '';
      selectedBloodType = data['blood_type'] ?? 'A+';
      selectedSex = data['sex'] ?? 'Prefer not to say';
      heightController.text = data['height'] ?? '';
      weightController.text = data['weight'] ?? '';
      historyController.text = data['past_medical_history'] ?? '';
      if (data['date_of_birth'] != null) {
        selectedDOB = DateTime.tryParse(data['date_of_birth']);
      }

      smokes = data['smokes'] ?? false;
      cigarettesPerDay = data['cigarettes_per_day']?.toString() ?? '';
      drinksAlcohol = data['alcohol'] ?? false;
      usesDrugs = data['drugs'] ?? false;
      drugsList = List<String>.from(data['drugs_list'] ?? []);

      setState(() {
        medicalConditions = List<String>.from(data['medical_conditions'] ?? []);
        allergies = List<String>.from(data['allergies'] ?? []);
        emergencyContacts = List<String>.from(data['emergency_contacts'] ?? []);
        final meds = List<Map<String, dynamic>>.from(data['medications'] ?? []);
        for (var med in meds) {
          medNameControllers.add(TextEditingController(text: med['name']));
          medDosageControllers.add(TextEditingController(text: med['dosage']));
          medDays.add(List<String>.from(med['days'] ?? []));
          medTimes.add(med['time'] ?? '');
        }
      });
    }
  }

  Future<void> saveProfile() async {
    final uid = FirebaseAuth.instance.currentUser!.uid;
    final medications = List.generate(medNameControllers.length, (i) {
      return {
        'name': medNameControllers[i].text.trim(),
        'dosage': medDosageControllers[i].text.trim(),
        'days': medDays[i],
        'time': medTimes[i],
      };
    });

    await FirebaseFirestore.instance.collection("Users").doc(uid).set({
      "name": nameController.text.trim(),
      "date_of_birth": selectedDOB != null
          ? selectedDOB!.toIso8601String().split("T").first
          : null,
      "blood_type": selectedBloodType,
      "sex": selectedSex,
      "height": heightController.text.trim(),
      "weight": weightController.text.trim(),
      "past_medical_history": historyController.text.trim(),
      "medical_conditions": medicalConditions,
      "allergies": allergies,
      "emergency_contacts": emergencyContacts,
      "medications": medications,
      "smokes": smokes,
      "cigarettes_per_day": smokes ? int.tryParse(cigarettesPerDay) ?? 0 : 0,
      "alcohol": drinksAlcohol,
      "drugs": usesDrugs,
      "drugs_list": usesDrugs ? drugsList : [],
      "qr_code_link": "https://your-react-app.com/profile/$uid",
    });

    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("✅ Profile saved!")),
    );

    Navigator.push(
      context,
      MaterialPageRoute(builder: (_) => QRPage(uid: uid)),
    );
  }

  void logout() async {
    await FirebaseAuth.instance.signOut();
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(builder: (_) => const LoginPage()),
    );
  }

  Future<void> pickDOB() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDOB ?? DateTime(2000),
      firstDate: DateTime(1900),
      lastDate: DateTime.now(),
    );
    if (picked != null) {
      setState(() {
        selectedDOB = picked;
      });
    }
  }

  void addMedication() {
    setState(() {
      medNameControllers.add(TextEditingController());
      medDosageControllers.add(TextEditingController());
      medDays.add([]);
      medTimes.add(TimeOfDay.now().format(context));
    });
  }

  void toggleMedicationDay(int index, String day) {
    setState(() {
      if (medDays[index].contains(day)) {
        medDays[index].remove(day);
      } else {
        medDays[index].add(day);
      }
    });
  }

  Future<void> pickTime(int index) async {
    TimeOfDay? picked = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );
    if (picked != null) {
      setState(() {
        medTimes[index] = picked.format(context);
      });
    }
  }

  Widget buildMedicationCard(int index) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            TextField(
              controller: medNameControllers[index],
              decoration: const InputDecoration(labelText: "Medication Name"),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: medDosageControllers[index],
              decoration:
                  const InputDecoration(labelText: "Dosage (e.g., 500mg)"),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Text("Days: "),
                const SizedBox(width: 8),
                Wrap(
                  spacing: 4,
                  children: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                      .map((day) => FilterChip(
                            label: Text(day),
                            selected: medDays[index].contains(day),
                            onSelected: (_) => toggleMedicationDay(index, day),
                          ))
                      .toList(),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                const Text("Time: "),
                const SizedBox(width: 8),
                Text(medTimes[index]),
                const Spacer(),
                ElevatedButton(
                  onPressed: () => pickTime(index),
                  child: const Text("Pick Time"),
                ),
              ],
            )
          ],
        ),
      ),
    );
  }

  Widget buildChipInput({
    required String label,
    required TextEditingController controller,
    required List<String> list,
    required String hint,
  }) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: list
              .map((item) => Chip(
                    label: Text(item),
                    deleteIcon: const Icon(Icons.close),
                    onDeleted: () => setState(() => list.remove(item)),
                  ))
              .toList(),
        ),
        const SizedBox(height: 8),
        TextField(
          controller: controller,
          onSubmitted: (val) {
            if (val.trim().isNotEmpty) {
              setState(() {
                list.add(val.trim());
              });
              controller.clear();
            }
          },
          decoration: InputDecoration(
            hintText: hint,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          ),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    final isFormFilled = nameController.text.trim().isNotEmpty;

    return Scaffold(
      appBar: AppBar(
        title: const Text("Your Medical Profile"),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: "Log out",
            onPressed: logout,
          ),
        ],
      ),
      body: Center(
        child: Container(
          constraints: const BoxConstraints(maxWidth: 650),
          margin: const EdgeInsets.all(20),
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 12)],
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Center(
                  child: CircleAvatar(
                    radius: 32,
                    backgroundColor: Colors.teal,
                    child: Icon(Icons.person, size: 32, color: Colors.white),
                  ),
                ),
                const SizedBox(height: 16),
                const Text(
                  "Emergency Medical Info",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                  textAlign: TextAlign.center,
                ),
                const SizedBox(height: 24),
                TextField(
                  controller: nameController,
                  decoration: InputDecoration(
                    labelText: "Full Name",
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  onChanged: (_) => setState(() {}),
                ),
                const SizedBox(height: 20),
                Row(
                  children: [
                    const Text("Date of Birth: ",
                        style: TextStyle(fontSize: 16)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        selectedDOB != null
                            ? DateFormat.yMMMMd().format(selectedDOB!)
                            : "Not selected",
                        style: const TextStyle(
                            fontSize: 16, fontWeight: FontWeight.w500),
                      ),
                    ),
                    ElevatedButton(
                      onPressed: pickDOB,
                      child: const Text("Pick Date"),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                DropdownButtonFormField<String>(
                  value: selectedSex,
                  decoration: InputDecoration(
                    labelText: "Sex",
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  items: ['Male', 'Female', 'Other', 'Prefer not to say']
                      .map((sex) =>
                          DropdownMenuItem(value: sex, child: Text(sex)))
                      .toList(),
                  onChanged: (val) => setState(() => selectedSex = val!),
                ),
                const SizedBox(height: 20),
                DropdownButtonFormField<String>(
                  value: selectedBloodType,
                  decoration: InputDecoration(
                    labelText: "Blood Type",
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                  items: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
                      .map((type) =>
                          DropdownMenuItem(value: type, child: Text(type)))
                      .toList(),
                  onChanged: (val) => setState(() => selectedBloodType = val!),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: heightController,
                  decoration: InputDecoration(
                    labelText: "Height",
                    hintText: "e.g., 5'10\" or 178 cm",
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: weightController,
                  decoration: InputDecoration(
                    labelText: "Weight",
                    hintText: "e.g., 150 lbs or 68 kg",
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 20),
                TextField(
                  controller: historyController,
                  maxLines: 4,
                  decoration: InputDecoration(
                    labelText: "Past Medical History",
                    hintText: "Surgeries, diagnoses, chronic conditions, etc.",
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 24),
                SwitchListTile(
                  title: const Text("Do you smoke?"),
                  value: smokes,
                  onChanged: (val) => setState(() => smokes = val),
                ),
                if (smokes)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 20),
                    child: TextField(
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(
                        labelText: "Cigarettes per day",
                        border: OutlineInputBorder(),
                      ),
                      onChanged: (val) =>
                          setState(() => cigarettesPerDay = val),
                    ),
                  ),
                SwitchListTile(
                  title: const Text("Do you consume alcohol?"),
                  value: drinksAlcohol,
                  onChanged: (val) => setState(() => drinksAlcohol = val),
                ),
                SwitchListTile(
                  title: const Text("Do you take recreational drugs?"),
                  value: usesDrugs,
                  onChanged: (val) => setState(() => usesDrugs = val),
                ),
                if (usesDrugs)
                  buildChipInput(
                    label: "What drugs?",
                    controller: drugsController,
                    list: drugsList,
                    hint: "e.g., Cannabis, MDMA...",
                  ),
                buildChipInput(
                  label: "Medical Conditions",
                  controller: medicalController,
                  list: medicalConditions,
                  hint: "e.g., Asthma, Diabetes...",
                ),
                buildChipInput(
                  label: "Allergies",
                  controller: allergyController,
                  list: allergies,
                  hint: "e.g., Peanuts, Penicillin...",
                ),
                buildChipInput(
                  label: "Emergency Contacts (One per entry)",
                  controller: contactController,
                  list: emergencyContacts,
                  hint: "e.g., 111-222-3333",
                ),
                const SizedBox(height: 8),
                Row(
                  children: [
                    const Text(
                      "Medications",
                      style:
                          TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                    ),
                    const Spacer(),
                    TextButton.icon(
                      onPressed: addMedication,
                      icon: const Icon(Icons.add),
                      label: const Text("Add"),
                    )
                  ],
                ),
                Column(
                  children: List.generate(
                    medNameControllers.length,
                    (index) => buildMedicationCard(index),
                  ),
                ),
                const SizedBox(height: 20),
                ElevatedButton.icon(
                  onPressed: isFormFilled ? saveProfile : null,
                  icon: const Icon(Icons.qr_code),
                  label: const Text("Save and Generate QR",
                      style: TextStyle(fontSize: 16)),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
