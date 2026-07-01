import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_avatar.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../profile_provider.dart';
import '../profile_repository.dart';

class EditProfileScreen extends ConsumerStatefulWidget {
  const EditProfileScreen({super.key});

  @override
  ConsumerState<EditProfileScreen> createState() => _EditProfileScreenState();
}

class _EditProfileScreenState extends ConsumerState<EditProfileScreen> {
  final _nameCtrl = TextEditingController();
  final _bioCtrl = TextEditingController();
  final _formKey = GlobalKey<FormState>();

  String? _pendingAvatarUrl;
  bool _isUploading = false;
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    final profile = ref.read(myProfileProvider).valueOrNull;
    if (profile != null) {
      _nameCtrl.text = profile.displayName;
      _bioCtrl.text = profile.bio ?? '';
      _pendingAvatarUrl = profile.avatarUrl;
    }
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _bioCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickAvatar() async {
    final picker = ImagePicker();
    final file = await picker.pickImage(
      source: ImageSource.gallery,
      maxWidth: 800,
      maxHeight: 800,
      imageQuality: 85,
    );
    if (file == null) return;

    setState(() => _isUploading = true);
    try {
      final url = await ref.read(profileRepositoryProvider).uploadAvatar(file);
      setState(() {
        _pendingAvatarUrl = url;
        _isUploading = false;
      });
    } catch (e) {
      setState(() => _isUploading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Avatar yuklanmadi: $e')),
        );
      }
    }
  }

  Future<void> _save() async {
    if (!(_formKey.currentState?.validate() ?? false)) return;
    setState(() => _isSaving = true);
    try {
      await ref.read(myProfileProvider.notifier).saveProfile(
            displayName: _nameCtrl.text.trim(),
            bio: _bioCtrl.text.trim().isEmpty ? null : _bioCtrl.text.trim(),
            avatarUrl: _pendingAvatarUrl,
          );
      if (mounted) {
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Saqlashda xatolik: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final profile = ref.watch(myProfileProvider).valueOrNull;
    final scheme = Theme.of(context).colorScheme;

    return Scaffold(
      appBar: AppBar(
        title: Text('Profilni tahrirlash', style: AppTextStyles.heading3),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.space4),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Center(
                child: Stack(
                  children: [
                    AppAvatar(
                      imageUrl: _pendingAvatarUrl,
                      name: profile?.displayName ?? '',
                      size: AppAvatarSize.xl,
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: GestureDetector(
                        onTap: _isUploading ? null : _pickAvatar,
                        child: Container(
                          width: 32,
                          height: 32,
                          decoration: BoxDecoration(
                            color: AppColors.primary,
                            shape: BoxShape.circle,
                            border: Border.all(color: scheme.surface, width: 2),
                          ),
                          child: _isUploading
                              ? const Padding(
                                  padding: EdgeInsets.all(6),
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    color: Colors.white,
                                  ),
                                )
                              : const Icon(
                                  Icons.camera_alt_outlined,
                                  size: 16,
                                  color: Colors.white,
                                ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.space6),
              AppTextField(
                controller: _nameCtrl,
                label: 'Ism',
                validator: (v) =>
                    v == null || v.trim().isEmpty ? 'Ism kiritilishi shart' : null,
              ),
              const SizedBox(height: AppSpacing.space4),
              AppTextField(
                controller: _bioCtrl,
                label: 'Bio',
                maxLines: 4,
              ),
              const SizedBox(height: AppSpacing.space6),
              AppButton(
                label: 'Saqlash',
                onPressed: _isSaving ? null : _save,
                loading: _isSaving,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
