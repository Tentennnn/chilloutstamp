
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
  resetUserConfirmation: (username: string) => string;
  removeUserButton: string;
  removeUserConfirmation: (username: string) => string;
  // Share profile
  shareProfileTitle: (username: string) => string;
  shareProfileInstructions: string;
  copyLinkButton: string;
  copiedButton: string;
  shareUserButtonLabel: (username: string) => string;
}

export const translations: Record<'kh' | 'en', Translations> = {
  kh: {
    title: "កាតสะสมពិន្ទុកាแฟ",
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
    resetUserConfirmation: (username) => `តើអ្នកប្រាកដទេថាចង់កំណត់ត្រាឡើងវិញសម្រាប់ ${username}?`,
    removeUserButton: "លុបអ្នកប្រើ",
    removeUserConfirmation: (username) => `តើអ្នកប្រាកដទេថាចង់លុបអ្នកប្រើ ${username}? ទិន្នន័យទាំងអស់នឹងត្រូវបាត់បង់ជាអចិន្ត្រៃយ៍។`,
    shareProfileTitle: (username) => `តំណសម្រាប់ ${username}`,
    shareProfileInstructions: "អ្នកប្រើប្រាស់អាចស្កេនកូដ QR នេះ ឬប្រើតំណដើម្បីបើកកាតរបស់ពួកគេដោយផ្ទាល់។",
    copyLinkButton: "ចម្លងតំណ",
    copiedButton: "បានចម្លង!",
    shareUserButtonLabel: (username) => `ចែករំលែកកាតសម្រាប់ ${username}`,
  },
  en: {
    title: "Coffee Rewards Card",
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
    resetUserConfirmation: (username) => `Are you sure you want to reset the stamps for ${username}?`,
    removeUserButton: "Remove",
    removeUserConfirmation: (username) => `Are you sure you want to remove user ${username}? All their data will be permanently lost.`,
    shareProfileTitle: (username) => `Link for ${username}`,
    shareProfileInstructions: "The user can scan this QR code or use the link to open their card directly.",
    copyLinkButton: "Copy Link",
    copiedButton: "Copied!",
    shareUserButtonLabel: (username) => `Share card for ${username}`,
  },
};