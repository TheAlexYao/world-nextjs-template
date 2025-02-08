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

    console.log('Payment ID:', id);

    const payload: PayCommandInput = {
      reference: id,
      to: "0x097d029bdd8bd34b02bf47c601e79da294a62706",
      tokens: [
        {
          symbol: Tokens.WLD,
          token_amount: tokenToDecimals(0.1, Tokens.WLD).toString(),
        }
      ],
      description: "Split payment",
    };

    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed");
      return null;
    }

    try {
      const response = await MiniKit.commandsAsync.pay(payload);
      console.log('Payment response:', response);
      return response;
    } catch (err) {
      console.error('MiniKit payment error:', err);
      return null;
    }
  } catch (error) {
    console.error("Error initiating payment", error);
    return null;
  }
};

const handlePay = async () => {
  if (!MiniKit.isInstalled()) {
    console.error("MiniKit is not installed");
    return;
  }
  try {
    const sendPaymentResponse = await sendPayment();
    if (!sendPaymentResponse) {
      console.error('Payment failed or was cancelled');
      return;
    }

    const response = sendPaymentResponse.finalPayload;
    if (!response) {
      console.error('No final payload from payment');
      return;
    }

    if (response.status === "success") {
      const res = await fetch(`/api/confirm-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payload: response }),
      });
      const payment = await res.json();
      if (payment.success) {
        console.log("Payment successful!");
      } else {
        console.error("Payment confirmation failed");
      }
    }
  } catch (err) {
    console.error('Payment handling error:', err);
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
