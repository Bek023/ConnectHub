import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../core/router/app_routes.dart';
import '../../../core/theme/app_spacing.dart';
import '../../../core/theme/app_text_styles.dart';
import '../../../shared/widgets/app_button.dart';
import '../../../shared/widgets/app_text_field.dart';
import '../groups_notifier.dart';
import '../groups_repository.dart';

class JoinByCodeScreen extends ConsumerStatefulWidget {
  const JoinByCodeScreen({super.key});

  @override
  ConsumerState<JoinByCodeScreen> createState() => _JoinByCodeScreenState();
}

class _JoinByCodeScreenState extends ConsumerState<JoinByCodeScreen> {
  final _ctrl = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  Future<void> _join() async {
    final code = _ctrl.text.trim();
    if (code.isEmpty) {
      setState(() => _error = 'Kodni kiriting');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final group =
          await ref.read(groupsRepositoryProvider).joinGroupByCode(code);
      ref.read(myGroupsProvider.notifier).addGroup(group);
      if (mounted) {
        context.pop();
        context.push(AppRoutes.groupDetailRoute(group.id));
      }
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString().replaceFirst('Exception: ', ''));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Kod bilan qo\'shilish')),
      body: Padding(
        padding: const EdgeInsets.all(AppSpacing.space6),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: AppSpacing.space6),
            const Icon(
              Icons.group_add_outlined,
              size: 64,
              color: Color(0xFF6C63FF),
            ),
            const SizedBox(height: AppSpacing.space5),
            Text(
              'Taklif kodini kiriting',
              style: AppTextStyles.heading3,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.space2),
            Text(
              'Guruh admini tomonidan berilgan kodni kiriting',
              style: AppTextStyles.bodyMd,
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: AppSpacing.space6),
            AppTextField(
              controller: _ctrl,
              label: 'Taklif kodi',
              hint: 'ABC123',
              errorText: _error,
            ),
            const SizedBox(height: AppSpacing.space5),
            SizedBox(
              width: double.infinity,
              child: AppButton(
                label: 'Qo\'shilish',
                variant: AppButtonVariant.primary,
                loading: _loading,
                onPressed: _loading ? null : _join,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
