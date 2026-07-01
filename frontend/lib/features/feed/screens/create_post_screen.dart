import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';

import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../auth/auth_notifier.dart';
import '../../auth/user_model.dart';
import '../feed_notifier.dart';

class CreatePostScreen extends ConsumerStatefulWidget {
  const CreatePostScreen({super.key, this.groupId, this.channelId});

  final String? groupId;
  final String? channelId;

  @override
  ConsumerState<CreatePostScreen> createState() => _CreatePostScreenState();
}

class _CreatePostScreenState extends ConsumerState<CreatePostScreen> {
  final _controller = TextEditingController();
  final _picker = ImagePicker();
  final List<XFile> _images = [];
  bool _submitting = false;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<void> _pickImages() async {
    final picked = await _picker.pickMultiImage(imageQuality: 85);
    if (picked.isEmpty) return;
    setState(() {
      _images.addAll(picked);
      if (_images.length > 4) _images.removeRange(4, _images.length);
    });
  }

  void _removeImage(int index) => setState(() => _images.removeAt(index));

  Future<void> _submit() async {
    final content = _controller.text.trim();
    if (content.isEmpty) return;
    setState(() => _submitting = true);
    try {
      await ref.read(feedProvider.notifier).createPost(
            content: content,
            groupId: widget.groupId,
            channelId: widget.channelId,
          );
      if (mounted) Navigator.of(context).pop();
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString().replaceFirst('Exception: ', ''))),
      );
    } finally {
      if (mounted) setState(() => _submitting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final user = ref.watch(authProvider).valueOrNull;
    final canSubmit =
        _controller.text.trim().isNotEmpty && !_submitting;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Yangi post'),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: AppSpacing.space3),
            child: AppButton(
              label: 'Yuborish',
              variant: AppButtonVariant.primary,
              size: AppButtonSize.sm,
              loading: _submitting,
              onPressed: canSubmit ? _submit : null,
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(AppSpacing.space4),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _UserRow(user: user),
                  const SizedBox(height: AppSpacing.space4),
                  TextField(
                    controller: _controller,
                    autofocus: true,
                    maxLines: null,
                    maxLength: 2000,
                    decoration: const InputDecoration(
                      hintText: 'Nimani ulashmoqchisiz?',
                      border: InputBorder.none,
                      counterText: '',
                    ),
                    style: AppTextStyles.bodyLg,
                    onChanged: (_) => setState(() {}),
                  ),
                  if (_images.isNotEmpty) ...[
                    const SizedBox(height: AppSpacing.space4),
                    _ImagePreviewRow(
                      images: _images,
                      onRemove: _removeImage,
                    ),
                  ],
                ],
              ),
            ),
          ),
          const Divider(height: 1),
          _ToolBar(
            onPickImages: _images.length < 4 ? _pickImages : null,
          ),
        ],
      ),
    );
  }
}

class _UserRow extends StatelessWidget {
  const _UserRow({required this.user});
  final UserModel? user;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        CircleAvatar(
          radius: 20,
          backgroundColor: AppColors.primary,
          child: Text(
            user?.displayName.isNotEmpty == true
                ? user!.displayName[0].toUpperCase()
                : 'U',
            style: const TextStyle(color: Colors.white),
          ),
        ),
        const SizedBox(width: AppSpacing.space3),
        Text(
          user?.displayName ?? '',
          style: AppTextStyles.labelLg,
        ),
      ],
    );
  }
}

class _ImagePreviewRow extends StatelessWidget {
  const _ImagePreviewRow({required this.images, required this.onRemove});
  final List<XFile> images;
  final void Function(int) onRemove;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 100,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: images.length,
        separatorBuilder: (_, __) => const SizedBox(width: AppSpacing.space2),
        itemBuilder: (ctx, i) {
          return Stack(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(8),
                child: Image.network(
                  images[i].path,
                  width: 100,
                  height: 100,
                  fit: BoxFit.cover,
                ),
              ),
              Positioned(
                top: 4,
                right: 4,
                child: GestureDetector(
                  onTap: () => onRemove(i),
                  child: Container(
                    decoration: const BoxDecoration(
                      color: Colors.black54,
                      shape: BoxShape.circle,
                    ),
                    padding: const EdgeInsets.all(2),
                    child: const Icon(Icons.close, size: 14, color: Colors.white),
                  ),
                ),
              ),
            ],
          );
        },
      ),
    );
  }
}

class _ToolBar extends StatelessWidget {
  const _ToolBar({required this.onPickImages});
  final VoidCallback? onPickImages;

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Padding(
        padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.space2,
          vertical: AppSpacing.space2,
        ),
        child: Row(
          children: [
            IconButton(
              icon: const Icon(Icons.image_outlined),
              onPressed: onPickImages,
              tooltip: 'Rasm qo\'shish',
            ),
          ],
        ),
      ),
    );
  }
}
