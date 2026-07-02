import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:connecthub/core/storage/preferences.dart';
import 'package:connecthub/main.dart';
import 'package:connecthub/shared/providers/theme_provider.dart';

void main() {
  testWidgets('app builds without crashing', (WidgetTester tester) async {
    SharedPreferences.setMockInitialValues({});
    final prefs = await AppPreferences.create();

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          appPreferencesProvider.overrideWithValue(prefs),
        ],
        child: const ConnectHubApp(),
      ),
    );

    expect(find.byType(ConnectHubApp), findsOneWidget);
  });
}
