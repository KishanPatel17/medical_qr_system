import 'package:flutter/material.dart';
import 'package:qr_flutter/qr_flutter.dart';

class QRPage extends StatelessWidget {
  final String uid;
  const QRPage({required this.uid, super.key});

  @override
  Widget build(BuildContext context) {
    final profileUrl = "https://medicalqrsystem.web.app/profile/$uid";

    return Scaffold(
      appBar: AppBar(title: const Text("Emergency QR")),
      body: Center(
        child: Container(
          padding: const EdgeInsets.all(24),
          margin: const EdgeInsets.all(16),
          constraints: const BoxConstraints(maxWidth: 500),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: const [
              BoxShadow(
                  color: Colors.black12, blurRadius: 12, offset: Offset(0, 4)),
            ],
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Text(
                "🚨 Scan to Access Emergency Medical Info",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              QrImageView(
                data: profileUrl,
                size: 250,
                backgroundColor: Colors.white,
              ),
              const SizedBox(height: 16),
              SelectableText(
                profileUrl,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 14, color: Colors.black45),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                icon: const Icon(Icons.arrow_back),
                label: const Text("Back"),
                onPressed: () => Navigator.pop(context),
              )
            ],
          ),
        ),
      ),
    );
  }
}
