// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'app_localizations.dart';

// ignore_for_file: type=lint

/// The translations for Russian (`ru`).
class AppLocalizationsRu extends AppLocalizations {
  AppLocalizationsRu([String locale = 'ru']) : super(locale);

  @override
  String get appName => 'ConnectHub';

  @override
  String get ok => 'OK';

  @override
  String get cancel => 'Отмена';

  @override
  String get save => 'Сохранить';

  @override
  String get delete => 'Удалить';

  @override
  String get edit => 'Изменить';

  @override
  String get close => 'Закрыть';

  @override
  String get confirm => 'Подтвердить';

  @override
  String get retry => 'Повторить';

  @override
  String get loading => 'Загрузка...';

  @override
  String get error => 'Произошла ошибка';

  @override
  String get noInternet => 'Нет подключения к интернету';

  @override
  String get unknownError => 'Неизвестная ошибка';

  @override
  String get emptyState => 'Пусто';

  @override
  String get search => 'Поиск';

  @override
  String get send => 'Отправить';

  @override
  String get back => 'Назад';

  @override
  String get next => 'Далее';

  @override
  String get done => 'Готово';

  @override
  String get yes => 'Да';

  @override
  String get no => 'Нет';

  @override
  String get navFeed => 'Лента';

  @override
  String get navGoals => 'Цели';

  @override
  String get navGroups => 'Группы';

  @override
  String get navChannels => 'Каналы';

  @override
  String get navProfile => 'Профиль';

  @override
  String get welcomeTitle => 'Добро пожаловать в ConnectHub';

  @override
  String get welcomeSubtitle => 'Общайтесь, развивайтесь, процветайте';

  @override
  String get welcomeLogin => 'Войти';

  @override
  String get welcomeRegister => 'Зарегистрироваться';

  @override
  String get loginTitle => 'Вход в аккаунт';

  @override
  String get loginEmail => 'Электронная почта';

  @override
  String get loginPassword => 'Пароль';

  @override
  String get loginButton => 'Войти';

  @override
  String get loginForgotPassword => 'Забыли пароль?';

  @override
  String get loginNoAccount => 'Нет аккаунта?';

  @override
  String get registerTitle => 'Регистрация';

  @override
  String get registerUsername => 'Имя пользователя';

  @override
  String get registerEmail => 'Электронная почта';

  @override
  String get registerPassword => 'Пароль';

  @override
  String get registerDisplayName => 'Имя';

  @override
  String get registerButton => 'Зарегистрироваться';

  @override
  String get registerHaveAccount => 'Уже есть аккаунт?';

  @override
  String get otpTitle => 'Введите код';

  @override
  String get otpSubtitle => 'Введите 6-значный код, отправленный на вашу почту';

  @override
  String get otpResend => 'Отправить снова';

  @override
  String get otpVerify => 'Подтвердить';

  @override
  String get forgotPasswordTitle => 'Восстановление пароля';

  @override
  String get forgotPasswordSubtitle => 'Введите вашу электронную почту';

  @override
  String get forgotPasswordButton => 'Отправить ссылку';

  @override
  String get forgotPasswordBack => 'Вернуться к входу';

  @override
  String get resetPasswordTitle => 'Новый пароль';

  @override
  String get resetPasswordCode => 'Код подтверждения';

  @override
  String get resetPasswordNew => 'Новый пароль';

  @override
  String get resetPasswordConfirm => 'Подтверждение пароля';

  @override
  String get resetPasswordButton => 'Обновить пароль';

  @override
  String get profileSetupTitle => 'Настройка профиля';

  @override
  String get profileSetupName => 'Ваше имя';

  @override
  String get profileSetupBio => 'О себе';

  @override
  String get profileSetupSkip => 'Пропустить';

  @override
  String get profileSetupSave => 'Сохранить';

  @override
  String get feedTitle => 'Лента';

  @override
  String get feedEmpty => 'Постов пока нет';

  @override
  String get feedCreatePost => 'Создать пост';

  @override
  String get feedLike => 'Нравится';

  @override
  String get feedComment => 'Комментарий';

  @override
  String get feedShare => 'Поделиться';

  @override
  String get feedFollowing => 'Подписки';

  @override
  String get feedDiscover => 'Обзор';

  @override
  String get createPostTitle => 'Новый пост';

  @override
  String get createPostHint => 'О чём вы думаете?';

  @override
  String get createPostPublish => 'Опубликовать';

  @override
  String get createPostAddMedia => 'Добавить медиа';

  @override
  String get goalsTitle => 'Цели';

  @override
  String get goalsEmpty => 'Целей пока нет';

  @override
  String get goalsCreate => 'Создать цель';

  @override
  String get goalsJoin => 'Присоединиться';

  @override
  String get goalsProgress => 'Прогресс';

  @override
  String get goalsCompleted => 'Завершённые';

  @override
  String get goalsActive => 'Активные';

  @override
  String goalsParticipants(int count) {
    return '$count участников';
  }

  @override
  String get groupsTitle => 'Группы';

  @override
  String get groupsEmpty => 'Групп пока нет';

  @override
  String get groupsCreate => 'Создать группу';

  @override
  String get groupsJoin => 'Присоединиться';

  @override
  String get groupsJoinByCode => 'Присоединиться по коду';

  @override
  String groupsMembers(int count) {
    return '$count участников';
  }

  @override
  String get groupsChat => 'Чат группы';

  @override
  String get groupsCall => 'Звонок';

  @override
  String get groupsLeave => 'Покинуть группу';

  @override
  String get channelsTitle => 'Каналы';

  @override
  String get channelsEmpty => 'Каналов пока нет';

  @override
  String get channelsCreate => 'Создать канал';

  @override
  String get channelsSubscribe => 'Подписаться';

  @override
  String get channelsUnsubscribe => 'Отписаться';

  @override
  String channelsSubscribers(int count) {
    return '$count подписчиков';
  }

  @override
  String get chatEmpty => 'Сообщений пока нет';

  @override
  String get chatTypeMessage => 'Написать сообщение...';

  @override
  String get chatToday => 'Сегодня';

  @override
  String get chatYesterday => 'Вчера';

  @override
  String get chatEdited => 'изменено';

  @override
  String get chatDeleted => 'Сообщение удалено';

  @override
  String get chatReply => 'Ответить';

  @override
  String get chatCopy => 'Копировать';

  @override
  String get chatDeleteMessage => 'Удалить сообщение';

  @override
  String get chatEditMessage => 'Изменить сообщение';

  @override
  String get callsIncoming => 'Входящий звонок';

  @override
  String get callsAccept => 'Принять';

  @override
  String get callsDecline => 'Отклонить';

  @override
  String get callsEnd => 'Завершить';

  @override
  String get callsMute => 'Отключить микрофон';

  @override
  String get callsUnmute => 'Включить микрофон';

  @override
  String get callsVideoOff => 'Отключить видео';

  @override
  String get callsVideoOn => 'Включить видео';

  @override
  String get callsHistory => 'История звонков';

  @override
  String get callsHistoryEmpty => 'История звонков пуста';

  @override
  String get notificationsTitle => 'Уведомления';

  @override
  String get notificationsEmpty => 'Уведомлений нет';

  @override
  String get notificationsMarkAllRead => 'Отметить все как прочитанные';

  @override
  String get profileTitle => 'Профиль';

  @override
  String get profileEdit => 'Редактировать профиль';

  @override
  String get profilePosts => 'Посты';

  @override
  String get profileGoals => 'Цели';

  @override
  String get profileGroups => 'Группы';

  @override
  String get profileActivity => 'Последняя активность';

  @override
  String get profileActivityEmpty => 'Активности пока нет';

  @override
  String get profileVerified => 'Подтверждён';

  @override
  String get profileMessage => 'Сообщение';

  @override
  String get profileLogout => 'Выйти';

  @override
  String get profileLogoutConfirm => 'Вы уверены, что хотите выйти?';

  @override
  String get profileDeleteAccount => 'Удалить аккаунт';

  @override
  String get editProfileTitle => 'Редактировать профиль';

  @override
  String get editProfileName => 'Имя';

  @override
  String get editProfileBio => 'О себе';

  @override
  String get editProfileAvatar => 'Выбрать фото';

  @override
  String get editProfileNameRequired => 'Имя обязательно';

  @override
  String get settingsTitle => 'Настройки';

  @override
  String get settingsAccount => 'Аккаунт';

  @override
  String get settingsSecurity => 'Безопасность';

  @override
  String get settingsAppearance => 'Внешний вид';

  @override
  String get settingsLanguage => 'Язык';

  @override
  String get settingsDangerZone => 'Опасная зона';

  @override
  String get settingsVersion => 'Версия';

  @override
  String get changePasswordTitle => 'Изменить пароль';

  @override
  String get changePasswordCurrent => 'Текущий пароль';

  @override
  String get changePasswordNew => 'Новый пароль';

  @override
  String get changePasswordConfirm => 'Подтвердите пароль';

  @override
  String get changePasswordSuccess => 'Пароль успешно изменён';

  @override
  String get changePasswordMinLength => 'Минимум 8 символов';

  @override
  String get changePasswordMismatch => 'Пароли не совпадают';

  @override
  String get twoFaTitle => 'Двухфакторная аутентификация';

  @override
  String get twoFaEnabled => 'Включена';

  @override
  String get twoFaDisabled => 'Отключена';

  @override
  String get twoFaEnable => 'Включить 2FA';

  @override
  String get twoFaDisable => 'Отключить 2FA';

  @override
  String get twoFaCode => '6-значный TOTP код';

  @override
  String get twoFaCodeRequired => 'Введите 6-значный код';

  @override
  String get twoFaEnableHint =>
      'Для включения 2FA настройте приложение-аутентификатор с помощью URI ниже.';

  @override
  String get twoFaDisableHint =>
      'Для отключения 2FA введите код из вашего приложения-аутентификатора.';

  @override
  String get twoFaUriLabel => 'OTP URI (нажмите для копирования)';

  @override
  String get twoFaUriCopied => 'URI скопирован';

  @override
  String get twoFaEnabledSuccess => '2FA включена. Войдите заново.';

  @override
  String get twoFaDisabledSuccess => '2FA отключена';

  @override
  String get pinTitle => 'PIN-код';

  @override
  String get pinEnter => 'Введите PIN-код';

  @override
  String get pinNew => 'Введите новый PIN';

  @override
  String get pinConfirm => 'Подтвердите PIN';

  @override
  String get pinMismatch => 'PIN-коды не совпадают, попробуйте снова';

  @override
  String get pinWrong => 'Неверный PIN';

  @override
  String get pinSet => 'Установлен';

  @override
  String get pinSetSuccess => 'PIN-код установлен';

  @override
  String get pinRemove => 'Удалить';

  @override
  String get pinRemoveSuccess => 'PIN-код удалён';

  @override
  String get biometric => 'Биометрия';

  @override
  String get biometricReason =>
      'Подтвердите для включения биометрической аутентификации';

  @override
  String get appearanceTitle => 'Внешний вид';

  @override
  String get themeDark => 'Тёмная';

  @override
  String get themeDarkSubtitle => 'Тёмный фон';

  @override
  String get themeLight => 'Светлая';

  @override
  String get themeLightSubtitle => 'Белый фон';

  @override
  String get themeSystem => 'Системная';

  @override
  String get themeSystemSubtitle => 'Следовать системным настройкам';

  @override
  String get languageTitle => 'Язык';

  @override
  String get languageUz => 'O\'zbek';

  @override
  String get languageRu => 'Русский';

  @override
  String get languageEn => 'English';

  @override
  String get deleteAccountTitle => 'Удалить аккаунт';

  @override
  String get deleteAccountConfirm =>
      'Это действие нельзя отменить. Все ваши данные будут удалены.';

  @override
  String validationRequired(String field) {
    return '$field обязательно';
  }

  @override
  String get validationEmail => 'Введите корректный адрес электронной почты';

  @override
  String validationMinLength(int min) {
    return 'Минимум $min символов';
  }
}
