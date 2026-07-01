import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';
import '../../core/theme/app_text_styles.dart';

class AppTextField extends StatefulWidget {
  const AppTextField({
    super.key,
    this.controller,
    this.label,
    this.hint,
    this.errorText,
    this.prefixIcon,
    this.isPassword = false,
    this.keyboardType,
    this.textInputAction,
    this.onChanged,
    this.onSubmitted,
    this.validator,
    this.inputFormatters,
    this.enabled = true,
    this.maxLines = 1,
    this.maxLength,
    this.autofocus = false,
    this.focusNode,
  });

  final TextEditingController? controller;
  final String? label;
  final String? hint;
  final String? errorText;
  final Widget? prefixIcon;
  final bool isPassword;
  final TextInputType? keyboardType;
  final TextInputAction? textInputAction;
  final ValueChanged<String>? onChanged;
  final ValueChanged<String>? onSubmitted;
  final FormFieldValidator<String>? validator;
  final List<TextInputFormatter>? inputFormatters;
  final bool enabled;
  final int maxLines;
  final int? maxLength;
  final bool autofocus;
  final FocusNode? focusNode;

  @override
  State<AppTextField> createState() => _AppTextFieldState();
}

class _AppTextFieldState extends State<AppTextField> {
  bool _obscure = true;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final colors = theme.colorScheme;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (widget.label != null) ...[
          Text(
            widget.label!,
            style: AppTextStyles.labelLg.copyWith(color: colors.onSurface),
          ),
          const SizedBox(height: AppSpacing.space2),
        ],
        TextFormField(
          controller: widget.controller,
          focusNode: widget.focusNode,
          obscureText: widget.isPassword && _obscure,
          keyboardType: widget.keyboardType,
          textInputAction: widget.textInputAction,
          onChanged: widget.onChanged,
          onFieldSubmitted: widget.onSubmitted,
          validator: widget.validator,
          inputFormatters: widget.inputFormatters,
          enabled: widget.enabled,
          maxLines: widget.isPassword ? 1 : widget.maxLines,
          maxLength: widget.maxLength,
          autofocus: widget.autofocus,
          style: AppTextStyles.bodyLg.copyWith(color: colors.onSurface),
          decoration: InputDecoration(
            hintText: widget.hint,
            hintStyle: AppTextStyles.bodyLg.copyWith(
              color: AppColors.neutral400,
            ),
            errorText: widget.errorText,
            errorStyle: AppTextStyles.bodySmError,
            prefixIcon: widget.prefixIcon,
            suffixIcon: widget.isPassword
                ? IconButton(
                    icon: Icon(
                      _obscure ? Icons.visibility_off : Icons.visibility,
                      color: AppColors.neutral400,
                    ),
                    onPressed: () => setState(() => _obscure = !_obscure),
                  )
                : null,
            counterText: '',
          ),
        ),
      ],
    );
  }
}
