export const verifyTelegramWebAppData = async (
    telegramInitData: string
  ): Promise<boolean> => {
    const initData = new URLSearchParams(telegramInitData);
    const hash = initData.get("hash");
    const dataToCheck: string[] = [];

    initData.sort();
    initData.forEach(
      (val, key) => key !== "hash" && dataToCheck.push(`${key}=${val}`)
    );

    const secret = CryptoJS.HmacSHA256(
      import.meta.env.VITE_BOT_TOKEN,
      "WebAppData"
    );
    const _hash = CryptoJS.HmacSHA256(
      dataToCheck.join("\n"),
      secret
    ).toString(CryptoJS.enc.Hex);

    return _hash === hash;
  };

export const extractUserId = (initData) => {
    if (!initData) return;

    const params = new URLSearchParams(initData);
    const user = params.get("user");
    if (!user) return;
    const userData = JSON.parse(user);
    return userData.id;
  };