import crypto from "crypto";

export interface KTOdemeParams {
  orderId: string;        // benzersiz sipariş no
  amount: number;         // kuruş cinsinden (299 TL → 29900)
  email: string;
  cardHolderName: string;
  cardNumber: string;
  cardExpireMonth: string;
  cardExpireYear: string;
  cardCVV2: string;
}

const KT_CONFIG = {
  merchantId: process.env.KT_MERCHANT_ID ?? "",
  customerId: process.env.KT_CUSTOMER_ID ?? "",
  userName: process.env.KT_USERNAME ?? "",
  password: process.env.KT_PASSWORD ?? "",
  okUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/odeme/basarili`,
  failUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/odeme/basarisiz`,
  apiUrl: "https://sanalpos.kuveytturk.com.tr/ServiceGateWay/Home/ThreeDModelPayGate",
};

function sha1Base64(text: string): string {
  return crypto.createHash("sha1").update(text, "utf8").digest("base64");
}

export function buildKTFormData(params: KTOdemeParams) {
  const hashedPassword = sha1Base64(KT_CONFIG.password);
  const hashData = sha1Base64(
    `${KT_CONFIG.merchantId}${params.orderId}${params.amount}${KT_CONFIG.okUrl}${KT_CONFIG.failUrl}${KT_CONFIG.userName}${hashedPassword}`,
  );

  return {
    MerchantId: KT_CONFIG.merchantId,
    UserName: KT_CONFIG.userName,
    HashData: hashData,
    Id: params.orderId,
    Amount: params.amount.toString(),
    CurrencyCode: "0949",           // TRY
    InstallmentCount: "0",
    OkUrl: KT_CONFIG.okUrl,
    FailUrl: KT_CONFIG.failUrl,
    CardType: "Troy",
    Pan: params.cardNumber.replace(/\s/g, ""),
    Cvv2: params.cardCVV2,
    CardHolderName: params.cardHolderName,
    Year: params.cardExpireYear,
    Month: params.cardExpireMonth,
    TransactionType: "Sale",
    TransactionSecurity: "3",       // 3D Secure
    Email: params.email,
    CustomerId: KT_CONFIG.customerId,
    BatchId: "0",
    lang: "tr",
    apiUrl: KT_CONFIG.apiUrl,
  };
}

export function verifyKTCallback(params: Record<string, string>): boolean {
  const { MerchantId, MerchantOrderId, Amount, ResponseCode } = params;
  const hashedPassword = sha1Base64(KT_CONFIG.password);
  const expectedHash = sha1Base64(
    `${MerchantId}${MerchantOrderId}${Amount}${KT_CONFIG.okUrl}${KT_CONFIG.failUrl}${KT_CONFIG.userName}${hashedPassword}`,
  );
  return expectedHash === params.HashData && ResponseCode === "00";
}
