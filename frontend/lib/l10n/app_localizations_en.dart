// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for English (`en`).
class AppLocalizationsEn extends AppLocalizations {
  AppLocalizationsEn([String locale = 'en']) : super(locale);

  @override
  String get appName => 'ConnectHub';

  @override
  String get ok => 'OK';

  @override
  String get cancel => 'Cancel';

  @override
  String get save => 'Save';

  @override
  String get delete => 'Delete';

  @override
  String get edit => 'Edit';

  @override
  String get close => 'Close';

  @override
  String get confirm => 'Confirm';

  @override
  String get retry => 'Retry';

  @override
  String get loading => 'Loading...';

  @override
  String get error => 'Something went wrong';

  @override
  String get noInternet => 'No internet connection';

  @override
  String get unknownError => 'Unknown error';

  @override
  String get emptyState => 'Nothing here yet';

  @override
  String get search => 'Search';

  @override
  String get send => 'Send';

  @override
  String get back => 'Back';

  @override
  String get next => 'Next';

  @override
  String get done => 'Done';

  @override
  String get yes => 'Yes';

  @override
  String get no => 'No';

  @override
  String get navFeed => 'Feed';

  @override
  String get navGoals => 'Goals';

  @override
  String get navGroups => 'Groups';

  @override
  String get navChannels => 'Channels';

  @override
  String get navProfile => 'Profile';

  @override
  String get welcomeTitle => 'Welcome to ConnectHub';

  @override
  String get welcomeSubtitle => 'Connect, grow, thrive';

  @override
  String get welcomeLogin => 'Log in';

  @override
  String get welcomeRegister => 'Sign up';

  @override
  String get loginTitle => 'Log in';

  @override
  String get loginEmail => 'Email';

  @override
  String get loginPassword => 'Password';

  @override
  String get loginButton => 'Log in';

  @override
  String get loginForgotPassword => 'Forgot password?';

  @override
  String get loginNoAccount => 'Don\'t have an account?';

  @override
  String get registerTitle => 'Sign up';

  @override
  String get registerUsername => 'Username';

  @override
  String get registerEmail => 'Email';

  @override
  String get registerPassword => 'Password';

  @override
  String get registerDisplayName => 'Display name';

  @override
  String get registerButton => 'Sign up';

  @override
  String get registerHaveAccount => 'Already have an account?';

  @override
  String get otpTitle => 'Enter code';

  @override
  String get otpSubtitle => 'Enter the 6-digit code sent to your email';

  @override
  String get otpResend => 'Resend';

  @override
  String get otpVerify => 'Verify';

  @override
  String get forgotPasswordTitle => 'Reset password';

  @override
  String get forgotPasswordSubtitle => 'Enter your email address';

  @override
  String get forgotPasswordButton => 'Send link';

  @override
  String get forgotPasswordBack => 'Back to login';

  @override
  String get resetPasswordTitle => 'New password';

  @override
  String get resetPasswordCode => 'Verification code';

  @override
  String get resetPasswordNew => 'New password';

  @override
  String get resetPasswordConfirm => 'Confirm password';

  @override
  String get resetPasswordButton => 'Update password';

  @override
  String get profileSetupTitle => 'Set up profile';

  @override
  String get profileSetupName => 'Your name';

  @override
  String get profileSetupBio => 'About you';

  @override
  String get profileSetupSkip => 'Skip';

  @override
  String get profileSetupSave => 'Save';

  @override
  String get feedTitle => 'Feed';

  @override
  String get feedEmpty => 'No posts yet';

  @override
  String get feedCreatePost => 'Create post';

  @override
  String get feedLike => 'Like';

  @override
  String get feedComment => 'Comment';

  @override
  String get feedShare => 'Share';

  @override
  String get feedFollowing => 'Following';

  @override
  String get feedDiscover => 'Discover';

  @override
  String get createPostTitle => 'New post';

  @override
  String get createPostHint => 'What\'s on your mind?';

  @override
  String get createPostPublish => 'Publish';

  @override
  String get createPostAddMedia => 'Add media';

  @override
  String get goalsTitle => 'Goals';

  @override
  String get goalsEmpty => 'No goals yet';

  @override
  String get goalsCreate => 'Create goal';

  @override
  String get goalsJoin => 'Join';

  @override
  String get goalsProgress => 'Progress';

  @override
  String get goalsCompleted => 'Completed';

  @override
  String get goalsActive => 'Active';

  @override
  String goalsParticipants(int count) {
    return '$count participants';
  }

  @override
  String get groupsTitle => 'Groups';

  @override
  String get groupsEmpty => 'No groups yet';

  @override
  String get groupsCreate => 'Create group';

  @override
  String get groupsJoin => 'Join';

  @override
  String get groupsJoinByCode => 'Join by code';

  @override
  String groupsMembers(int count) {
    return '$count members';
  }

  @override
  String get groupsChat => 'Group chat';

  @override
  String get groupsCall => 'Call';

  @override
  String get groupsLeave => 'Leave group';

  @override
  String get channelsTitle => 'Channels';

  @override
  String get channelsEmpty => 'No channels yet';

  @override
  String get channelsCreate => 'Create channel';

  @override
  String get channelsSubscribe => 'Subscribe';

  @override
  String get channelsUnsubscribe => 'Unsubscribe';

  @override
  String channelsSubscribers(int count) {
    return '$count subscribers';
  }

  @override
  String get chatEmpty => 'No messages yet';

  @override
  String get chatTypeMessage => 'Type a message...';

  @override
  String get chatToday => 'Today';

  @override
  String get chatYesterday => 'Yesterday';

  @override
  String get chatEdited => 'edited';

  @override
  String get chatDeleted => 'Message deleted';

  @override
  String get chatReply => 'Reply';

  @override
  String get chatCopy => 'Copy';

  @override
  String get chatDeleteMessage => 'Delete message';

  @override
  String get chatEditMessage => 'Edit message';

  @override
  String get callsIncoming => 'Incoming call';

  @override
  String get callsAccept => 'Accept';

  @override
  String get callsDecline => 'Decline';

  @override
  String get callsEnd => 'End call';

  @override
  String get callsMute => 'Mute';

  @override
  String get callsUnmute => 'Unmute';

  @override
  String get callsVideoOff => 'Turn off video';

  @override
  String get callsVideoOn => 'Turn on video';

  @override
  String get callsHistory => 'Call history';

  @override
  String get callsHistoryEmpty => 'No call history';

  @override
  String get notificationsTitle => 'Notifications';

  @override
  String get notificationsEmpty => 'No notifications';

  @override
  String get notificationsMarkAllRead => 'Mark all as read';

  @override
  String get profileTitle => 'Profile';

  @override
  String get profileEdit => 'Edit profile';

  @override
  String get profilePosts => 'Posts';

  @override
  String get profileGoals => 'Goals';

  @override
  String get profileGroups => 'Groups';

  @override
  String get profileActivity => 'Recent activity';

  @override
  String get profileActivityEmpty => 'No activity yet';

  @override
  String get profileVerified => 'Verified';

  @override
  String get profileMessage => 'Message';

  @override
  String get profileLogout => 'Log out';

  @override
  String get profileLogoutConfirm => 'Are you sure you want to log out?';

  @override
  String get profileDeleteAccount => 'Delete account';

  @override
  String get editProfileTitle => 'Edit profile';

  @override
  String get editProfileName => 'Name';

  @override
  String get editProfileBio => 'Bio';

  @override
  String get editProfileAvatar => 'Choose photo';

  @override
  String get editProfileNameRequired => 'Name is required';

  @override
  String get settingsTitle => 'Settings';

  @override
  String get settingsAccount => 'Account';

  @override
  String get settingsSecurity => 'Security';

  @override
  String get settingsAppearance => 'Appearance';

  @override
  String get settingsLanguage => 'Language';

  @override
  String get settingsDangerZone => 'Danger zone';

  @override
  String get settingsVersion => 'Version';

  @override
  String get changePasswordTitle => 'Change password';

  @override
  String get changePasswordCurrent => 'Current password';

  @override
  String get changePasswordNew => 'New password';

  @override
  String get changePasswordConfirm => 'Confirm password';

  @override
  String get changePasswordSuccess => 'Password changed successfully';

  @override
  String get changePasswordMinLength => 'At least 8 characters required';

  @override
  String get changePasswordMismatch => 'Passwords do not match';

  @override
  String get twoFaTitle => 'Two-factor authentication';

  @override
  String get twoFaEnabled => 'Enabled';

  @override
  String get twoFaDisabled => 'Disabled';

  @override
  String get twoFaEnable => 'Enable 2FA';

  @override
  String get twoFaDisable => 'Disable 2FA';

  @override
  String get twoFaCode => '6-digit TOTP code';

  @override
  String get twoFaCodeRequired => 'Enter 6-digit code';

  @override
  String get twoFaEnableHint =>
      'To enable 2FA, configure your authenticator app with the URI below.';

  @override
  String get twoFaDisableHint =>
      'To disable 2FA, enter the code from your authenticator app.';

  @override
  String get twoFaUriLabel => 'OTP URI (tap to copy)';

  @override
  String get twoFaUriCopied => 'URI copied';

  @override
  String get twoFaEnabledSuccess => '2FA enabled. Please log in again.';

  @override
  String get twoFaDisabledSuccess => '2FA disabled';

  @override
  String get pinTitle => 'PIN code';

  @override
  String get pinEnter => 'Enter PIN code';

  @override
  String get pinNew => 'Enter new PIN';

  @override
  String get pinConfirm => 'Confirm PIN';

  @override
  String get pinMismatch => 'PINs do not match, please try again';

  @override
  String get pinWrong => 'Incorrect PIN';

  @override
  String get pinSet => 'Set';

  @override
  String get pinSetSuccess => 'PIN code set';

  @override
  String get pinRemove => 'Remove';

  @override
  String get pinRemoveSuccess => 'PIN code removed';

  @override
  String get biometric => 'Biometrics';

  @override
  String get biometricReason => 'Confirm to enable biometric authentication';

  @override
  String get appearanceTitle => 'Appearance';

  @override
  String get themeDark => 'Dark';

  @override
  String get themeDarkSubtitle => 'Dark background';

  @override
  String get themeLight => 'Light';

  @override
  String get themeLightSubtitle => 'White background';

  @override
  String get themeSystem => 'System';

  @override
  String get themeSystemSubtitle => 'Follow system settings';

  @override
  String get languageTitle => 'Language';

  @override
  String get languageUz => 'O\'zbek';

  @override
  String get languageRu => 'Русский';

  @override
  String get languageEn => 'English';

  @override
  String get deleteAccountTitle => 'Delete account';

  @override
  String get deleteAccountConfirm =>
      'This action cannot be undone. All your data will be permanently deleted.';

  @override
  String validationRequired(String field) {
    return '$field is required';
  }

  @override
  String get validationEmail => 'Enter a valid email address';

  @override
  String validationMinLength(int min) {
    return 'At least $min characters required';
  }
}
