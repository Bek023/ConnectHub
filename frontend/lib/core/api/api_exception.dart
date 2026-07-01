/// Backend javob formati: API_DOCS.md > "Response format".
/// Muvaffaqiyatsiz javob: { success: false, statusCode, message }
/// message — string yoki string array (validatsiya xatolari) bo'lishi mumkin.
class ApiException implements Exception {
  final int? statusCode;
  final String message;
  final List<String>? validationErrors;

  const ApiException({
    required this.message,
    this.statusCode,
    this.validationErrors,
  });

  bool get isValidationError =>
      validationErrors != null && validationErrors!.isNotEmpty;

  bool get isUnauthorized => statusCode == 401;

  factory ApiException.fromResponseData(dynamic data, {int? statusCode}) {
    if (data is Map<String, dynamic>) {
      final rawMessage = data['message'];
      if (rawMessage is List) {
        final errors = rawMessage.map((e) => e.toString()).toList();
        return ApiException(
          message: errors.join(', '),
          statusCode: statusCode ?? data['statusCode'] as int?,
          validationErrors: errors,
        );
      }
      return ApiException(
        message: rawMessage?.toString() ?? 'Xato yuz berdi',
        statusCode: statusCode ?? data['statusCode'] as int?,
      );
    }
    return ApiException(
      message: 'Xato yuz berdi',
      statusCode: statusCode,
    );
  }

  factory ApiException.network() => const ApiException(
        message: "Internet ulanishini tekshiring",
      );

  factory ApiException.unknown([Object? error]) => ApiException(
        message: error?.toString() ?? 'Noma\'lum xato yuz berdi',
      );

  @override
  String toString() => 'ApiException($statusCode): $message';
}
