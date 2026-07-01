import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:intl/intl.dart' as intl;

import 'app_localizations_en.dart';
import 'app_localizations_ru.dart';
import 'app_localizations_uz.dart';

// ignore_for_file: type=lint

/// Callers can lookup localized strings with an instance of AppLocalizations
/// returned by `AppLocalizations.of(context)`.
///
/// Applications need to include `AppLocalizations.delegate()` in their app's
/// `localizationDelegates` list, and the locales they support in the app's
/// `supportedLocales` list. For example:
///
/// ```dart
/// import 'l10n/app_localizations.dart';
///
/// return MaterialApp(
///   localizationsDelegates: AppLocalizations.localizationsDelegates,
///   supportedLocales: AppLocalizations.supportedLocales,
///   home: MyApplicationHome(),
/// );
/// ```
///
/// ## Update pubspec.yaml
///
/// Please make sure to update your pubspec.yaml to include the following
/// packages:
///
/// ```yaml
/// dependencies:
///   # Internationalization support.
///   flutter_localizations:
///     sdk: flutter
///   intl: any # Use the pinned version from flutter_localizations
///
///   # Rest of dependencies
/// ```
///
/// ## iOS Applications
///
/// iOS applications define key application metadata, including supported
/// locales, in an Info.plist file that is built into the application bundle.
/// To configure the locales supported by your app, you’ll need to edit this
/// file.
///
/// First, open your project’s ios/Runner.xcworkspace Xcode workspace file.
/// Then, in the Project Navigator, open the Info.plist file under the Runner
/// project’s Runner folder.
///
/// Next, select the Information Property List item, select Add Item from the
/// Editor menu, then select Localizations from the pop-up menu.
///
/// Select and expand the newly-created Localizations item then, for each
/// locale your application supports, add a new item and select the locale
/// you wish to add from the pop-up menu in the Value field. This list should
/// be consistent with the languages listed in the AppLocalizations.supportedLocales
/// property.
abstract class AppLocalizations {
  AppLocalizations(String locale)
      : localeName = intl.Intl.canonicalizedLocale(locale.toString());

  final String localeName;

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  static const LocalizationsDelegate<AppLocalizations> delegate =
      _AppLocalizationsDelegate();

  /// A list of this localizations delegate along with the default localizations
  /// delegates.
  ///
  /// Returns a list of localizations delegates containing this delegate along with
  /// GlobalMaterialLocalizations.delegate, GlobalCupertinoLocalizations.delegate,
  /// and GlobalWidgetsLocalizations.delegate.
  ///
  /// Additional delegates can be added by appending to this list in
  /// MaterialApp. This list does not have to be used at all if a custom list
  /// of delegates is preferred or required.
  static const List<LocalizationsDelegate<dynamic>> localizationsDelegates =
      <LocalizationsDelegate<dynamic>>[
    delegate,
    GlobalMaterialLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
  ];

  /// A list of this localizations delegate's supported locales.
  static const List<Locale> supportedLocales = <Locale>[
    Locale('en'),
    Locale('ru'),
    Locale('uz')
  ];

  /// Application name
  ///
  /// In uz, this message translates to:
  /// **'ConnectHub'**
  String get appName;

  /// No description provided for @ok.
  ///
  /// In uz, this message translates to:
  /// **'OK'**
  String get ok;

  /// No description provided for @cancel.
  ///
  /// In uz, this message translates to:
  /// **'Bekor qilish'**
  String get cancel;

  /// No description provided for @save.
  ///
  /// In uz, this message translates to:
  /// **'Saqlash'**
  String get save;

  /// No description provided for @delete.
  ///
  /// In uz, this message translates to:
  /// **'O\'chirish'**
  String get delete;

  /// No description provided for @edit.
  ///
  /// In uz, this message translates to:
  /// **'Tahrirlash'**
  String get edit;

  /// No description provided for @close.
  ///
  /// In uz, this message translates to:
  /// **'Yopish'**
  String get close;

  /// No description provided for @confirm.
  ///
  /// In uz, this message translates to:
  /// **'Tasdiqlash'**
  String get confirm;

  /// No description provided for @retry.
  ///
  /// In uz, this message translates to:
  /// **'Qayta urinish'**
  String get retry;

  /// No description provided for @loading.
  ///
  /// In uz, this message translates to:
  /// **'Yuklanmoqda...'**
  String get loading;

  /// No description provided for @error.
  ///
  /// In uz, this message translates to:
  /// **'Xato yuz berdi'**
  String get error;

  /// No description provided for @noInternet.
  ///
  /// In uz, this message translates to:
  /// **'Internet aloqasi yo\'q'**
  String get noInternet;

  /// No description provided for @unknownError.
  ///
  /// In uz, this message translates to:
  /// **'Noma\'lum xato'**
  String get unknownError;

  /// No description provided for @emptyState.
  ///
  /// In uz, this message translates to:
  /// **'Hali hech narsa yo\'q'**
  String get emptyState;

  /// No description provided for @search.
  ///
  /// In uz, this message translates to:
  /// **'Qidirish'**
  String get search;

  /// No description provided for @send.
  ///
  /// In uz, this message translates to:
  /// **'Yuborish'**
  String get send;

  /// No description provided for @back.
  ///
  /// In uz, this message translates to:
  /// **'Orqaga'**
  String get back;

  /// No description provided for @next.
  ///
  /// In uz, this message translates to:
  /// **'Keyingisi'**
  String get next;

  /// No description provided for @done.
  ///
  /// In uz, this message translates to:
  /// **'Tayyor'**
  String get done;

  /// No description provided for @yes.
  ///
  /// In uz, this message translates to:
  /// **'Ha'**
  String get yes;

  /// No description provided for @no.
  ///
  /// In uz, this message translates to:
  /// **'Yo\'q'**
  String get no;

  /// No description provided for @navFeed.
  ///
  /// In uz, this message translates to:
  /// **'Tasma'**
  String get navFeed;

  /// No description provided for @navGoals.
  ///
  /// In uz, this message translates to:
  /// **'Maqsadlar'**
  String get navGoals;

  /// No description provided for @navGroups.
  ///
  /// In uz, this message translates to:
  /// **'Guruhlar'**
  String get navGroups;

  /// No description provided for @navChannels.
  ///
  /// In uz, this message translates to:
  /// **'Kanallar'**
  String get navChannels;

  /// No description provided for @navProfile.
  ///
  /// In uz, this message translates to:
  /// **'Profil'**
  String get navProfile;

  /// No description provided for @welcomeTitle.
  ///
  /// In uz, this message translates to:
  /// **'ConnectHub ga xush kelibsiz'**
  String get welcomeTitle;

  /// No description provided for @welcomeSubtitle.
  ///
  /// In uz, this message translates to:
  /// **'Bog\'laning, o\'sing, rivojlaning'**
  String get welcomeSubtitle;

  /// No description provided for @welcomeLogin.
  ///
  /// In uz, this message translates to:
  /// **'Kirish'**
  String get welcomeLogin;

  /// No description provided for @welcomeRegister.
  ///
  /// In uz, this message translates to:
  /// **'Ro\'yxatdan o\'tish'**
  String get welcomeRegister;

  /// No description provided for @loginTitle.
  ///
  /// In uz, this message translates to:
  /// **'Hisobga kirish'**
  String get loginTitle;

  /// No description provided for @loginEmail.
  ///
  /// In uz, this message translates to:
  /// **'Elektron pochta'**
  String get loginEmail;

  /// No description provided for @loginPassword.
  ///
  /// In uz, this message translates to:
  /// **'Parol'**
  String get loginPassword;

  /// No description provided for @loginButton.
  ///
  /// In uz, this message translates to:
  /// **'Kirish'**
  String get loginButton;

  /// No description provided for @loginForgotPassword.
  ///
  /// In uz, this message translates to:
  /// **'Parolni unutdingizmi?'**
  String get loginForgotPassword;

  /// No description provided for @loginNoAccount.
  ///
  /// In uz, this message translates to:
  /// **'Hisob yo\'qmi?'**
  String get loginNoAccount;

  /// No description provided for @registerTitle.
  ///
  /// In uz, this message translates to:
  /// **'Ro\'yxatdan o\'tish'**
  String get registerTitle;

  /// No description provided for @registerUsername.
  ///
  /// In uz, this message translates to:
  /// **'Foydalanuvchi nomi'**
  String get registerUsername;

  /// No description provided for @registerEmail.
  ///
  /// In uz, this message translates to:
  /// **'Elektron pochta'**
  String get registerEmail;

  /// No description provided for @registerPassword.
  ///
  /// In uz, this message translates to:
  /// **'Parol'**
  String get registerPassword;

  /// No description provided for @registerDisplayName.
  ///
  /// In uz, this message translates to:
  /// **'Ism'**
  String get registerDisplayName;

  /// No description provided for @registerButton.
  ///
  /// In uz, this message translates to:
  /// **'Ro\'yxatdan o\'tish'**
  String get registerButton;

  /// No description provided for @registerHaveAccount.
  ///
  /// In uz, this message translates to:
  /// **'Hisobingiz bormi?'**
  String get registerHaveAccount;

  /// No description provided for @otpTitle.
  ///
  /// In uz, this message translates to:
  /// **'Kodni kiriting'**
  String get otpTitle;

  /// No description provided for @otpSubtitle.
  ///
  /// In uz, this message translates to:
  /// **'Elektron pochtangizga yuborilgan 6 raqamli kodni kiriting'**
  String get otpSubtitle;

  /// No description provided for @otpResend.
  ///
  /// In uz, this message translates to:
  /// **'Qayta yuborish'**
  String get otpResend;

  /// No description provided for @otpVerify.
  ///
  /// In uz, this message translates to:
  /// **'Tasdiqlash'**
  String get otpVerify;

  /// No description provided for @forgotPasswordTitle.
  ///
  /// In uz, this message translates to:
  /// **'Parolni tiklash'**
  String get forgotPasswordTitle;

  /// No description provided for @forgotPasswordSubtitle.
  ///
  /// In uz, this message translates to:
  /// **'Elektron pochtangizni kiriting'**
  String get forgotPasswordSubtitle;

  /// No description provided for @forgotPasswordButton.
  ///
  /// In uz, this message translates to:
  /// **'Havolani yuborish'**
  String get forgotPasswordButton;

  /// No description provided for @forgotPasswordBack.
  ///
  /// In uz, this message translates to:
  /// **'Kirishga qaytish'**
  String get forgotPasswordBack;

  /// No description provided for @resetPasswordTitle.
  ///
  /// In uz, this message translates to:
  /// **'Yangi parol'**
  String get resetPasswordTitle;

  /// No description provided for @resetPasswordCode.
  ///
  /// In uz, this message translates to:
  /// **'Tasdiqlash kodi'**
  String get resetPasswordCode;

  /// No description provided for @resetPasswordNew.
  ///
  /// In uz, this message translates to:
  /// **'Yangi parol'**
  String get resetPasswordNew;

  /// No description provided for @resetPasswordConfirm.
  ///
  /// In uz, this message translates to:
  /// **'Parolni tasdiqlash'**
  String get resetPasswordConfirm;

  /// No description provided for @resetPasswordButton.
  ///
  /// In uz, this message translates to:
  /// **'Parolni yangilash'**
  String get resetPasswordButton;

  /// No description provided for @profileSetupTitle.
  ///
  /// In uz, this message translates to:
  /// **'Profilni sozlash'**
  String get profileSetupTitle;

  /// No description provided for @profileSetupName.
  ///
  /// In uz, this message translates to:
  /// **'Ismingiz'**
  String get profileSetupName;

  /// No description provided for @profileSetupBio.
  ///
  /// In uz, this message translates to:
  /// **'O\'zingiz haqida'**
  String get profileSetupBio;

  /// No description provided for @profileSetupSkip.
  ///
  /// In uz, this message translates to:
  /// **'O\'tkazib yuborish'**
  String get profileSetupSkip;

  /// No description provided for @profileSetupSave.
  ///
  /// In uz, this message translates to:
  /// **'Saqlash'**
  String get profileSetupSave;

  /// No description provided for @feedTitle.
  ///
  /// In uz, this message translates to:
  /// **'Tasma'**
  String get feedTitle;

  /// No description provided for @feedEmpty.
  ///
  /// In uz, this message translates to:
  /// **'Hali postlar yo\'q'**
  String get feedEmpty;

  /// No description provided for @feedCreatePost.
  ///
  /// In uz, this message translates to:
  /// **'Post yaratish'**
  String get feedCreatePost;

  /// No description provided for @feedLike.
  ///
  /// In uz, this message translates to:
  /// **'Yoqtirish'**
  String get feedLike;

  /// No description provided for @feedComment.
  ///
  /// In uz, this message translates to:
  /// **'Izoh'**
  String get feedComment;

  /// No description provided for @feedShare.
  ///
  /// In uz, this message translates to:
  /// **'Ulashish'**
  String get feedShare;

  /// No description provided for @feedFollowing.
  ///
  /// In uz, this message translates to:
  /// **'Kuzatilayotganlar'**
  String get feedFollowing;

  /// No description provided for @feedDiscover.
  ///
  /// In uz, this message translates to:
  /// **'Kashfiyot'**
  String get feedDiscover;

  /// No description provided for @createPostTitle.
  ///
  /// In uz, this message translates to:
  /// **'Yangi post'**
  String get createPostTitle;

  /// No description provided for @createPostHint.
  ///
  /// In uz, this message translates to:
  /// **'Nima haqida yozyapsiz?'**
  String get createPostHint;

  /// No description provided for @createPostPublish.
  ///
  /// In uz, this message translates to:
  /// **'E\'lon qilish'**
  String get createPostPublish;

  /// No description provided for @createPostAddMedia.
  ///
  /// In uz, this message translates to:
  /// **'Media qo\'shish'**
  String get createPostAddMedia;

  /// No description provided for @goalsTitle.
  ///
  /// In uz, this message translates to:
  /// **'Maqsadlar'**
  String get goalsTitle;

  /// No description provided for @goalsEmpty.
  ///
  /// In uz, this message translates to:
  /// **'Hali maqsadlar yo\'q'**
  String get goalsEmpty;

  /// No description provided for @goalsCreate.
  ///
  /// In uz, this message translates to:
  /// **'Maqsad yaratish'**
  String get goalsCreate;

  /// No description provided for @goalsJoin.
  ///
  /// In uz, this message translates to:
  /// **'Qo\'shilish'**
  String get goalsJoin;

  /// No description provided for @goalsProgress.
  ///
  /// In uz, this message translates to:
  /// **'Jarayon'**
  String get goalsProgress;

  /// No description provided for @goalsCompleted.
  ///
  /// In uz, this message translates to:
  /// **'Bajarilgan'**
  String get goalsCompleted;

  /// No description provided for @goalsActive.
  ///
  /// In uz, this message translates to:
  /// **'Faol'**
  String get goalsActive;

  /// No description provided for @goalsParticipants.
  ///
  /// In uz, this message translates to:
  /// **'{count} ishtirokchi'**
  String goalsParticipants(int count);

  /// No description provided for @groupsTitle.
  ///
  /// In uz, this message translates to:
  /// **'Guruhlar'**
  String get groupsTitle;

  /// No description provided for @groupsEmpty.
  ///
  /// In uz, this message translates to:
  /// **'Hali guruhlar yo\'q'**
  String get groupsEmpty;

  /// No description provided for @groupsCreate.
  ///
  /// In uz, this message translates to:
  /// **'Guruh yaratish'**
  String get groupsCreate;

  /// No description provided for @groupsJoin.
  ///
  /// In uz, this message translates to:
  /// **'Qo\'shilish'**
  String get groupsJoin;

  /// No description provided for @groupsJoinByCode.
  ///
  /// In uz, this message translates to:
  /// **'Kod orqali qo\'shilish'**
  String get groupsJoinByCode;

  /// No description provided for @groupsMembers.
  ///
  /// In uz, this message translates to:
  /// **'{count} a\'zo'**
  String groupsMembers(int count);

  /// No description provided for @groupsChat.
  ///
  /// In uz, this message translates to:
  /// **'Guruh chati'**
  String get groupsChat;

  /// No description provided for @groupsCall.
  ///
  /// In uz, this message translates to:
  /// **'Qo\'ng\'iroq'**
  String get groupsCall;

  /// No description provided for @groupsLeave.
  ///
  /// In uz, this message translates to:
  /// **'Guruhdan chiqish'**
  String get groupsLeave;

  /// No description provided for @channelsTitle.
  ///
  /// In uz, this message translates to:
  /// **'Kanallar'**
  String get channelsTitle;

  /// No description provided for @channelsEmpty.
  ///
  /// In uz, this message translates to:
  /// **'Hali kanallar yo\'q'**
  String get channelsEmpty;

  /// No description provided for @channelsCreate.
  ///
  /// In uz, this message translates to:
  /// **'Kanal yaratish'**
  String get channelsCreate;

  /// No description provided for @channelsSubscribe.
  ///
  /// In uz, this message translates to:
  /// **'Obuna bo\'lish'**
  String get channelsSubscribe;

  /// No description provided for @channelsUnsubscribe.
  ///
  /// In uz, this message translates to:
  /// **'Obunani bekor qilish'**
  String get channelsUnsubscribe;

  /// No description provided for @channelsSubscribers.
  ///
  /// In uz, this message translates to:
  /// **'{count} obunachi'**
  String channelsSubscribers(int count);

  /// No description provided for @chatEmpty.
  ///
  /// In uz, this message translates to:
  /// **'Hali xabarlar yo\'q'**
  String get chatEmpty;

  /// No description provided for @chatTypeMessage.
  ///
  /// In uz, this message translates to:
  /// **'Xabar yozing...'**
  String get chatTypeMessage;

  /// No description provided for @chatToday.
  ///
  /// In uz, this message translates to:
  /// **'Bugun'**
  String get chatToday;

  /// No description provided for @chatYesterday.
  ///
  /// In uz, this message translates to:
  /// **'Kecha'**
  String get chatYesterday;

  /// No description provided for @chatEdited.
  ///
  /// In uz, this message translates to:
  /// **'tahrirlangan'**
  String get chatEdited;

  /// No description provided for @chatDeleted.
  ///
  /// In uz, this message translates to:
  /// **'Xabar o\'chirildi'**
  String get chatDeleted;

  /// No description provided for @chatReply.
  ///
  /// In uz, this message translates to:
  /// **'Javob berish'**
  String get chatReply;

  /// No description provided for @chatCopy.
  ///
  /// In uz, this message translates to:
  /// **'Nusxalash'**
  String get chatCopy;

  /// No description provided for @chatDeleteMessage.
  ///
  /// In uz, this message translates to:
  /// **'Xabarni o\'chirish'**
  String get chatDeleteMessage;

  /// No description provided for @chatEditMessage.
  ///
  /// In uz, this message translates to:
  /// **'Xabarni tahrirlash'**
  String get chatEditMessage;

  /// No description provided for @callsIncoming.
  ///
  /// In uz, this message translates to:
  /// **'Kiruvchi qo\'ng\'iroq'**
  String get callsIncoming;

  /// No description provided for @callsAccept.
  ///
  /// In uz, this message translates to:
  /// **'Qabul qilish'**
  String get callsAccept;

  /// No description provided for @callsDecline.
  ///
  /// In uz, this message translates to:
  /// **'Rad etish'**
  String get callsDecline;

  /// No description provided for @callsEnd.
  ///
  /// In uz, this message translates to:
  /// **'Tugatish'**
  String get callsEnd;

  /// No description provided for @callsMute.
  ///
  /// In uz, this message translates to:
  /// **'Mikrofon o\'chirish'**
  String get callsMute;

  /// No description provided for @callsUnmute.
  ///
  /// In uz, this message translates to:
  /// **'Mikrofon yoqish'**
  String get callsUnmute;

  /// No description provided for @callsVideoOff.
  ///
  /// In uz, this message translates to:
  /// **'Video o\'chirish'**
  String get callsVideoOff;

  /// No description provided for @callsVideoOn.
  ///
  /// In uz, this message translates to:
  /// **'Video yoqish'**
  String get callsVideoOn;

  /// No description provided for @callsHistory.
  ///
  /// In uz, this message translates to:
  /// **'Qo\'ng\'iroqlar tarixi'**
  String get callsHistory;

  /// No description provided for @callsHistoryEmpty.
  ///
  /// In uz, this message translates to:
  /// **'Qo\'ng\'iroqlar tarixi yo\'q'**
  String get callsHistoryEmpty;

  /// No description provided for @notificationsTitle.
  ///
  /// In uz, this message translates to:
  /// **'Bildirishnomalar'**
  String get notificationsTitle;

  /// No description provided for @notificationsEmpty.
  ///
  /// In uz, this message translates to:
  /// **'Bildirishnomalar yo\'q'**
  String get notificationsEmpty;

  /// No description provided for @notificationsMarkAllRead.
  ///
  /// In uz, this message translates to:
  /// **'Hammasini o\'qi'**
  String get notificationsMarkAllRead;

  /// No description provided for @profileTitle.
  ///
  /// In uz, this message translates to:
  /// **'Profil'**
  String get profileTitle;

  /// No description provided for @profileEdit.
  ///
  /// In uz, this message translates to:
  /// **'Profilni tahrirlash'**
  String get profileEdit;

  /// No description provided for @profilePosts.
  ///
  /// In uz, this message translates to:
  /// **'Post'**
  String get profilePosts;

  /// No description provided for @profileGoals.
  ///
  /// In uz, this message translates to:
  /// **'Maqsad'**
  String get profileGoals;

  /// No description provided for @profileGroups.
  ///
  /// In uz, this message translates to:
  /// **'Guruh'**
  String get profileGroups;

  /// No description provided for @profileActivity.
  ///
  /// In uz, this message translates to:
  /// **'So\'nggi faollik'**
  String get profileActivity;

  /// No description provided for @profileActivityEmpty.
  ///
  /// In uz, this message translates to:
  /// **'Hali hech qanday faollik yo\'q'**
  String get profileActivityEmpty;

  /// No description provided for @profileVerified.
  ///
  /// In uz, this message translates to:
  /// **'Tasdiqlangan'**
  String get profileVerified;

  /// No description provided for @profileMessage.
  ///
  /// In uz, this message translates to:
  /// **'Xabar'**
  String get profileMessage;

  /// No description provided for @profileLogout.
  ///
  /// In uz, this message translates to:
  /// **'Chiqish'**
  String get profileLogout;

  /// No description provided for @profileLogoutConfirm.
  ///
  /// In uz, this message translates to:
  /// **'Hisobdan chiqishni tasdiqlaysizmi?'**
  String get profileLogoutConfirm;

  /// No description provided for @profileDeleteAccount.
  ///
  /// In uz, this message translates to:
  /// **'Hisobni o\'chirish'**
  String get profileDeleteAccount;

  /// No description provided for @editProfileTitle.
  ///
  /// In uz, this message translates to:
  /// **'Profilni tahrirlash'**
  String get editProfileTitle;

  /// No description provided for @editProfileName.
  ///
  /// In uz, this message translates to:
  /// **'Ism'**
  String get editProfileName;

  /// No description provided for @editProfileBio.
  ///
  /// In uz, this message translates to:
  /// **'Bio'**
  String get editProfileBio;

  /// No description provided for @editProfileAvatar.
  ///
  /// In uz, this message translates to:
  /// **'Rasm tanlash'**
  String get editProfileAvatar;

  /// No description provided for @editProfileNameRequired.
  ///
  /// In uz, this message translates to:
  /// **'Ism kiritilishi shart'**
  String get editProfileNameRequired;

  /// No description provided for @settingsTitle.
  ///
  /// In uz, this message translates to:
  /// **'Sozlamalar'**
  String get settingsTitle;

  /// No description provided for @settingsAccount.
  ///
  /// In uz, this message translates to:
  /// **'Hisob'**
  String get settingsAccount;

  /// No description provided for @settingsSecurity.
  ///
  /// In uz, this message translates to:
  /// **'Xavfsizlik'**
  String get settingsSecurity;

  /// No description provided for @settingsAppearance.
  ///
  /// In uz, this message translates to:
  /// **'Ko\'rinish'**
  String get settingsAppearance;

  /// No description provided for @settingsLanguage.
  ///
  /// In uz, this message translates to:
  /// **'Til'**
  String get settingsLanguage;

  /// No description provided for @settingsDangerZone.
  ///
  /// In uz, this message translates to:
  /// **'Xavfli zona'**
  String get settingsDangerZone;

  /// No description provided for @settingsVersion.
  ///
  /// In uz, this message translates to:
  /// **'Versiya'**
  String get settingsVersion;

  /// No description provided for @changePasswordTitle.
  ///
  /// In uz, this message translates to:
  /// **'Parolni o\'zgartirish'**
  String get changePasswordTitle;

  /// No description provided for @changePasswordCurrent.
  ///
  /// In uz, this message translates to:
  /// **'Joriy parol'**
  String get changePasswordCurrent;

  /// No description provided for @changePasswordNew.
  ///
  /// In uz, this message translates to:
  /// **'Yangi parol'**
  String get changePasswordNew;

  /// No description provided for @changePasswordConfirm.
  ///
  /// In uz, this message translates to:
  /// **'Parolni tasdiqlang'**
  String get changePasswordConfirm;

  /// No description provided for @changePasswordSuccess.
  ///
  /// In uz, this message translates to:
  /// **'Parol muvaffaqiyatli o\'zgartirildi'**
  String get changePasswordSuccess;

  /// No description provided for @changePasswordMinLength.
  ///
  /// In uz, this message translates to:
  /// **'Kamida 8 ta belgi bo\'lishi kerak'**
  String get changePasswordMinLength;

  /// No description provided for @changePasswordMismatch.
  ///
  /// In uz, this message translates to:
  /// **'Parollar mos emas'**
  String get changePasswordMismatch;

  /// No description provided for @twoFaTitle.
  ///
  /// In uz, this message translates to:
  /// **'Ikki bosqichli autentifikatsiya'**
  String get twoFaTitle;

  /// No description provided for @twoFaEnabled.
  ///
  /// In uz, this message translates to:
  /// **'Yoqilgan'**
  String get twoFaEnabled;

  /// No description provided for @twoFaDisabled.
  ///
  /// In uz, this message translates to:
  /// **'O\'chirilgan'**
  String get twoFaDisabled;

  /// No description provided for @twoFaEnable.
  ///
  /// In uz, this message translates to:
  /// **'2FA ni yoqish'**
  String get twoFaEnable;

  /// No description provided for @twoFaDisable.
  ///
  /// In uz, this message translates to:
  /// **'2FA ni o\'chirish'**
  String get twoFaDisable;

  /// No description provided for @twoFaCode.
  ///
  /// In uz, this message translates to:
  /// **'6 raqamli TOTP kod'**
  String get twoFaCode;

  /// No description provided for @twoFaCodeRequired.
  ///
  /// In uz, this message translates to:
  /// **'6 raqamli kod kiriting'**
  String get twoFaCodeRequired;

  /// No description provided for @twoFaEnableHint.
  ///
  /// In uz, this message translates to:
  /// **'2FA yoqish uchun autentifikator ilovangizni quyidagi URI bilan sozlang.'**
  String get twoFaEnableHint;

  /// No description provided for @twoFaDisableHint.
  ///
  /// In uz, this message translates to:
  /// **'2FA o\'chirish uchun autentifikator ilovangizdan kodingizni kiriting.'**
  String get twoFaDisableHint;

  /// No description provided for @twoFaUriLabel.
  ///
  /// In uz, this message translates to:
  /// **'OTP URI (nusxalash uchun bosing)'**
  String get twoFaUriLabel;

  /// No description provided for @twoFaUriCopied.
  ///
  /// In uz, this message translates to:
  /// **'URI nusxalandi'**
  String get twoFaUriCopied;

  /// No description provided for @twoFaEnabledSuccess.
  ///
  /// In uz, this message translates to:
  /// **'2FA yoqildi. Qayta kiring.'**
  String get twoFaEnabledSuccess;

  /// No description provided for @twoFaDisabledSuccess.
  ///
  /// In uz, this message translates to:
  /// **'2FA o\'chirildi'**
  String get twoFaDisabledSuccess;

  /// No description provided for @pinTitle.
  ///
  /// In uz, this message translates to:
  /// **'PIN kod'**
  String get pinTitle;

  /// No description provided for @pinEnter.
  ///
  /// In uz, this message translates to:
  /// **'PIN kod kiriting'**
  String get pinEnter;

  /// No description provided for @pinNew.
  ///
  /// In uz, this message translates to:
  /// **'Yangi PIN kiriting'**
  String get pinNew;

  /// No description provided for @pinConfirm.
  ///
  /// In uz, this message translates to:
  /// **'PIN kodni tasdiqlang'**
  String get pinConfirm;

  /// No description provided for @pinMismatch.
  ///
  /// In uz, this message translates to:
  /// **'PIN kodlar mos emas, qaytadan kiriting'**
  String get pinMismatch;

  /// No description provided for @pinWrong.
  ///
  /// In uz, this message translates to:
  /// **'PIN noto\'g\'ri'**
  String get pinWrong;

  /// No description provided for @pinSet.
  ///
  /// In uz, this message translates to:
  /// **'O\'rnatilgan'**
  String get pinSet;

  /// No description provided for @pinSetSuccess.
  ///
  /// In uz, this message translates to:
  /// **'PIN kod o\'rnatildi'**
  String get pinSetSuccess;

  /// No description provided for @pinRemove.
  ///
  /// In uz, this message translates to:
  /// **'O\'chirish'**
  String get pinRemove;

  /// No description provided for @pinRemoveSuccess.
  ///
  /// In uz, this message translates to:
  /// **'PIN kod olib tashlandi'**
  String get pinRemoveSuccess;

  /// No description provided for @biometric.
  ///
  /// In uz, this message translates to:
  /// **'Biometrik'**
  String get biometric;

  /// No description provided for @biometricReason.
  ///
  /// In uz, this message translates to:
  /// **'Biometrik autentifikatsiyani yoqish uchun tasdiqlang'**
  String get biometricReason;

  /// No description provided for @appearanceTitle.
  ///
  /// In uz, this message translates to:
  /// **'Ko\'rinish'**
  String get appearanceTitle;

  /// No description provided for @themeDark.
  ///
  /// In uz, this message translates to:
  /// **'Qorong\'u'**
  String get themeDark;

  /// No description provided for @themeDarkSubtitle.
  ///
  /// In uz, this message translates to:
  /// **'Qora fon'**
  String get themeDarkSubtitle;

  /// No description provided for @themeLight.
  ///
  /// In uz, this message translates to:
  /// **'Yorug\''**
  String get themeLight;

  /// No description provided for @themeLightSubtitle.
  ///
  /// In uz, this message translates to:
  /// **'Oq fon'**
  String get themeLightSubtitle;

  /// No description provided for @themeSystem.
  ///
  /// In uz, this message translates to:
  /// **'Tizim'**
  String get themeSystem;

  /// No description provided for @themeSystemSubtitle.
  ///
  /// In uz, this message translates to:
  /// **'Qurilma sozlamalariga mos'**
  String get themeSystemSubtitle;

  /// No description provided for @languageTitle.
  ///
  /// In uz, this message translates to:
  /// **'Til'**
  String get languageTitle;

  /// No description provided for @languageUz.
  ///
  /// In uz, this message translates to:
  /// **'O\'zbek'**
  String get languageUz;

  /// No description provided for @languageRu.
  ///
  /// In uz, this message translates to:
  /// **'Русский'**
  String get languageRu;

  /// No description provided for @languageEn.
  ///
  /// In uz, this message translates to:
  /// **'English'**
  String get languageEn;

  /// No description provided for @deleteAccountTitle.
  ///
  /// In uz, this message translates to:
  /// **'Hisobni o\'chirish'**
  String get deleteAccountTitle;

  /// No description provided for @deleteAccountConfirm.
  ///
  /// In uz, this message translates to:
  /// **'Bu amalni qaytarib bo\'lmaydi. Barcha ma\'lumotlaringiz o\'chiriladi.'**
  String get deleteAccountConfirm;

  /// No description provided for @validationRequired.
  ///
  /// In uz, this message translates to:
  /// **'{field} kiritilishi shart'**
  String validationRequired(String field);

  /// No description provided for @validationEmail.
  ///
  /// In uz, this message translates to:
  /// **'To\'g\'ri elektron pochta manzilini kiriting'**
  String get validationEmail;

  /// No description provided for @validationMinLength.
  ///
  /// In uz, this message translates to:
  /// **'Kamida {min} ta belgi bo\'lishi kerak'**
  String validationMinLength(int min);
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();

  @override
  Future<AppLocalizations> load(Locale locale) {
    return SynchronousFuture<AppLocalizations>(lookupAppLocalizations(locale));
  }

  @override
  bool isSupported(Locale locale) =>
      <String>['en', 'ru', 'uz'].contains(locale.languageCode);

  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

AppLocalizations lookupAppLocalizations(Locale locale) {
  // Lookup logic when only language code is specified.
  switch (locale.languageCode) {
    case 'en':
      return AppLocalizationsEn();
    case 'ru':
      return AppLocalizationsRu();
    case 'uz':
      return AppLocalizationsUz();
  }

  throw FlutterError(
      'AppLocalizations.delegate failed to load unsupported locale "$locale". This is likely '
      'an issue with the localizations generation tool. Please file an issue '
      'on GitHub with a reproducible sample app and the gen-l10n configuration '
      'that was used.');
}
