"use client";
import {
  MiniKit,
  tokenToDecimals,
  Tokens,
  PayCommandInput,
} from "@worldcoin/minikit-js";
import { useState } from "react";

const sendPayment = async () => {
  try {
    const res = await fetch(`/api/initiate-payment`, {
      method: "POST",
    });

    const { id } = await res.json();

    console.log(id);

    const payload: PayCommandInput = {
      reference: id,
      to: "0x097d029bdd8bd34b02bf47c601e79da294a62706", // Your test wallet address
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(),
        }
      ], // Removed USDC, keeping only WLD
      description: "Watch this is a test",
    };
    if (MiniKit.isInstalled()) {
      return await MiniKit.commandsAsync.pay(payload);
    }
    return null;
  } catch (error: unknown) {
    console.log("Error sending payment", error);
    return null;
  }
};

const handlePay = async () => {
  if (!MiniKit.isInstalled()) {
    console.error("MiniKit is not installed");
    return;
  }
  const sendPaymentResponse = await sendPayment();
  const response = sendPaymentResponse?.finalPayload;
  if (!response) {
    return;
  }

  if (response.status == "success") {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/confirm-payment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: response }),
    });
    const payment = await res.json();
    if (payment.success) {
      // Congrats your payment was successful!
      console.log("SUCCESS!");
    } else {
      // Payment failed
      console.log("FAILED!");
    }
  }
};

export const PayBlock = () => {
  return (
    <button 
      onClick={handlePay}
      className="w-full px-6 py-3 bg-[#00A7B7] text-white rounded-full font-medium 
                active:bg-[#008999] active:scale-[0.98] transition-transform"
    >
      Pay 0.1 WLD
      <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-50">→</span>
    </button>
  );
};
