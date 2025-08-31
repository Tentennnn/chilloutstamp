export interface Translations {
  title: string;
  progressText: (count: number, total: number) => string;
  instructions: string;
  addStampButton: string;
  claimRewardButton: string;
  rewardReadyButton: string;
  startNewCardButton: string;
  rewardTitle: string;
  rewardMessage: string;
  closeButton: string;
  languageToggle: string;
  resetButton: string;
  resetConfirmation: string;
  // User auth
  loginTitle: string;
  loginInstructions: string;
  usernamePlaceholder: string;
  loginButton: string;
  loggingIn: string;
  logoutButton: string;
  welcomeMessage: (username: string) => string;
  userNotFoundError: string;
  // Login selector
  userLoginPrompt: string;
  adminLoginPrompt: string;
  // Admin auth & dashboard
  adminLoginTitle: string;
  adminLoginInstructions: string;
  passwordPlaceholder: string;
  adminLoginButton: string;
  adminDashboardTitle: string;
  createUserTitle: string;
  createUserInstructions: string;
  createUserButton: string;
  existingUsersTitle: string;
  userCreatedSuccess: (username: string) => string;
  userExistsError: (username: string) => string;
  backButton: string;
  resetUserStampsButton: string;
  removeUserButton: string;
  confirmButton: string;
  cancelButton: string;
  resetUserModalTitle: string;
  resetUserModalMessage: (username: string) => string;
  removeUserModalTitle: string;
  removeUserModalMessage: (username: string) => string;
  // Share profile
  shareProfileTitle: (username: string) => string;
  shareProfileInstructions: string;
  copyLinkButton: string;
  copiedButton: string;
  shareUserButtonLabel: (username: string) => string;
  viewCardButton: string;
  shareButton: string;
  // Import / Export
  importButton: string;
  exportButton: string;
  importModalTitle: string;
  importModalMessage: string;
  mergeButton: string;
  replaceButton: string;
  importSuccessMessage: (count: number) => string;
  importErrorMessage: string;
  // Search and Sort
  searchUsersPlaceholder: string;
  sortByLabel: string;
  sortUsernameAZ: string;
  sortUsernameZA: string;
  sortStampsLowHigh: string;
  sortStampsHighLow: string;
}

export const translations: Record<'kh' | 'en', Translations> = {
  kh: {
    title: "CHILLOUT COFFEE",
    progressText: (count, total) => `កែវទី ${count} នៃ ${total}`,
    instructions: "ប្រមូលត្រា 15 ដើម្បីទទួលបាន Blink Box Cup មួយ! សូមសួរ​បុគ្គលិក​ដើម្បី​បន្ថែម​ត្រា។",
    addStampButton: "បន្ថែមត្រា",
    claimRewardButton: "ទាមទាររង្វាន់",
    rewardReadyButton: "រង្វាន់រួចរាល់ហើយ!",
    startNewCardButton: "ចាប់ផ្តើមកាតថ្មី",
    rewardTitle: "សូមអបអរសាទរ!",
    rewardMessage: "អ្នកបានដោះសោរង្វាន់របស់អ្នកហើយ៖ Blink Box Cup មួយ។ សូមបង្ហាញកាតនេះដើម្បីប្តូរយករង្វាន់។",
    closeButton: "បិទ",
    languageToggle: "English",
    resetButton: "ចាប់ផ្តើម​សារ​ថ្មី",
    resetConfirmation: "តើអ្នកប្រាកដទេថាចង់ចាប់ផ្តើមសារជាថ្មី? ត្រាបច្ចុប្បន្នរបស់អ្នកនឹងត្រូវបាត់បង់។",
    loginTitle: "សូមស្វាគមន៍",
    loginInstructions: "បញ្ចូលឈ្មោះអ្នកប្រើរបស់អ្នក ដើម្បីរក្សាទុកត្រារបស់អ្នក។",
    usernamePlaceholder: "ឈ្មោះ​អ្នកប្រើប្រាស់",
    loginButton: "ចូល",
    loggingIn: "កំពុងចូល...",
    logoutButton: "ចាកចេញ",
    welcomeMessage: (username) => `សួស្តី, ${username}`,
    userNotFoundError: "រកមិនឃើញអ្នកប្រើទេ។ សូមស្នើសុំឱ្យអ្នកគ្រប់គ្រងបង្កើតគណនីសម្រាប់អ្នក។",
    userLoginPrompt: "ចូលគណនី​អ្នក​ប្រើ",
    adminLoginPrompt: "ចូលគណនី​អ្នកគ្រប់គ្រង",
    adminLoginTitle: "ចូលជាអ្នកគ្រប់គ្រង",
    adminLoginInstructions: "បញ្ចូលព័ត៌មានសម្ងាត់របស់អ្នកគ្រប់គ្រង។",
    passwordPlaceholder: "ពាក្យសម្ងាត់",
    adminLoginButton: "ចូល",
    adminDashboardTitle: "ផ្ទាំងគ្រប់គ្រង",
    createUserTitle: "បង្កើតអ្នកប្រើថ្មី",
    createUserInstructions: "បញ្ចូលឈ្មោះអ្នកប្រើដើម្បីបង្កើតកាតថ្មី។",
    createUserButton: "បង្កើតអ្នកប្រើ",
    existingUsersTitle: "អ្នកប្រើប្រាស់​ដែល​មាន​",
    userCreatedSuccess: (username) => `បានបង្កើតអ្នកប្រើ ${username} ដោយជោគជ័យ។`,
    userExistsError: (username) => `អ្នកប្រើ ${username} មានរួចហើយ។`,
    backButton: "ត្រឡប់ក្រោយ",
    resetUserStampsButton: "កំណត់ឡើងវិញ",
    removeUserButton: "លុបអ្នកប្រើ",
    confirmButton: "បញ្ជាក់",
    cancelButton: "បោះបង់",
    resetUserModalTitle: "កំណត់ត្រាឡើងវិញ?",
    resetUserModalMessage: (username) => `តើអ្នកប្រាកដទេថាចង់កំណត់ត្រាសម្រាប់ ${username} ឡើងវិញ? ចំនួនត្រារបស់ពួកគេនឹងក្លាយជា 0។`,
    removeUserModalTitle: "លុបអ្នកប្រើ?",
    removeUserModalMessage: (username) => `តើអ្នកប្រាកដទេថាចង់លុបអ្នកប្រើ ${username} ជាអចិន្ត្រៃយ៍? ទិន្នន័យទាំងអស់នឹងត្រូវបាត់បង់។`,
    shareProfileTitle: (username) => `តំណសម្រាប់ ${username}`,
    shareProfileInstructions: "អ្នកប្រើប្រាស់អាចស្កេនកូដ QR នេះ ឬប្រើតំណដើម្បីបើកកាតរបស់ពួកគេដោយផ្ទាល់។",
    copyLinkButton: "ចម្លងតំណ",
    copiedButton: "បានចម្លង!",
    shareUserButtonLabel: (username) => `ចែករំលែកកាតសម្រាប់ ${username}`,
    viewCardButton: "មើលកាត",
    shareButton: "ចែករំលែក",
    importButton: "នាំចូលទិន្នន័យ",
    exportButton: "នាំចេញទិន្នន័យ",
    importModalTitle: "នាំចូលទិន្នន័យអ្នកប្រើប្រាស់",
    importModalMessage: "តើអ្នកចង់បញ្ចូលទិន្នន័យថ្មីជាមួយទិន្នន័យដែលមានស្រាប់ ឬជំនួសទិន្នន័យបច្ចុប្បន្នទាំងអស់?",
    mergeButton: "បញ្ចូលគ្នា",
    replaceButton: "ជំនួស",
    importSuccessMessage: (count) => `បាននាំចូលអ្នកប្រើ ${count} នាក់ដោយជោគជ័យ។`,
    importErrorMessage: "ឯកសារមិនត្រឹមត្រូវ ឬទិន្នន័យខូច។ សូមព្យាយាមម្តងទៀត។",
    searchUsersPlaceholder: "ស្វែងរកអ្នកប្រើប្រាស់...",
    sortByLabel: "តម្រៀបតាម:",
    sortUsernameAZ: "ឈ្មោះអ្នកប្រើ (A-Z)",
    sortUsernameZA: "ឈ្មោះអ្នកប្រើ (Z-A)",
    sortStampsLowHigh: "ត្រា (តិចទៅច្រើន)",
    sortStampsHighLow: "ត្រា (ច្រើនទៅតិច)",
  },
  en: {
    title: "CHILLOUT COFFEE",
    progressText: (count, total) => `${count} of ${total} cups`,
    instructions: "Collect 15 stamps to get a free Blink Box Cup! Ask our staff to add a stamp.",
    addStampButton: "Add a Stamp",
    claimRewardButton: "Claim Reward",
    rewardReadyButton: "Reward Ready!",
    startNewCardButton: "Start New Card",
    rewardTitle: "Congratulations!",
    rewardMessage: "You've unlocked your reward: a free Blink Box Cup. Please show this to redeem.",
    closeButton: "Close",
    languageToggle: "ខ្មែរ",
    resetButton: "Start Over",
    resetConfirmation: "Are you sure you want to start over? Your current stamps will be lost.",
    loginTitle: "Welcome!",
    loginInstructions: "Enter your username to save your stamps.",
    usernamePlaceholder: "Username",
    loginButton: "Login",
    loggingIn: "Logging in...",
    logoutButton: "Log Out",
    welcomeMessage: (username) => `Hi, ${username}`,
    userNotFoundError: "User not found. Please ask an admin to create an account for you.",
    userLoginPrompt: "User Login",
    adminLoginPrompt: "Admin Login",
    adminLoginTitle: "Admin Login",
    adminLoginInstructions: "Enter your administrator credentials.",
    passwordPlaceholder: "Password",
    adminLoginButton: "Login",
    adminDashboardTitle: "Admin Dashboard",
    createUserTitle: "Create New User",
    createUserInstructions: "Enter a username to create a new card.",
    createUserButton: "Create User",
    existingUsersTitle: "Existing Users",
    userCreatedSuccess: (username) => `Successfully created user ${username}.`,
    userExistsError: (username) => `User ${username} already exists.`,
    backButton: "Back",
    resetUserStampsButton: "Reset",
    removeUserButton: "Remove",
    confirmButton: "Confirm",
    cancelButton: "Cancel",
    resetUserModalTitle: "Reset Stamps?",
    resetUserModalMessage: (username) => `Are you sure you want to reset the stamps for ${username}? Their count will be set to 0.`,
    removeUserModalTitle: "Remove User?",
    removeUserModalMessage: (username) => `Are you sure you want to permanently remove ${username}? This cannot be undone.`,
    shareProfileTitle: (username) => `Link for ${username}`,
    shareProfileInstructions: "The user can scan this QR code or use the link to open their card directly.",
    copyLinkButton: "Copy Link",
    copiedButton: "Copied!",
    shareUserButtonLabel: (username) => `Share card for ${username}`,
    viewCardButton: "View Card",
    shareButton: "Share",
    importButton: "Import Data",
    exportButton: "Export Data",
    importModalTitle: "Import User Data",
    importModalMessage: "Do you want to merge the new data with existing data, or replace all current data?",
    mergeButton: "Merge",
    replaceButton: "Replace",
    importSuccessMessage: (count) => `Successfully imported ${count} users.`,
    importErrorMessage: "Invalid file or corrupted data. Please try again.",
    searchUsersPlaceholder: "Search users...",
    sortByLabel: "Sort by:",
    sortUsernameAZ: "Username (A-Z)",
    sortUsernameZA: "Username (Z-A)",
    sortStampsLowHigh: "Stamps (Low to High)",
    sortStampsHighLow: "Stamps (High to Low)",
  },
};