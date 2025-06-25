import { useState } from "react";
import { Button } from "./ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import Image from "next/image";
import { otpVerification, sendOTPemail } from "@/action/auth.action";

function OTPModal({ email, accountId }: { email: string; accountId: string }) {
  const [isLoading, setisLoading] = useState(false);
  const [openModal, setopenModal] = useState(true);
  const [otp, setOTP] = useState("");

  const handleOnSubmit = async () => {
    try {
      setisLoading(true);
      await otpVerification({ accountId, otp });
    } catch (error) {
      console.log(error instanceof Error ? error.message : "Unknow Error");
    } finally {
      setisLoading(false);
    }
  };

  const handleOnResendCode = async () => {
    try {
      const res = await sendOTPemail(email);
      if (res) {
        accountId = res;
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    openModal && (
      <section className="fixed inset-0 flex flex-col justify-center items-center bg-black/20">
        <div className="relative max-w-sm w-full bg-white px-8  py-4 rounded-[14px] flex flex-col gap-1 justify-center items-center">
          <Image
            src="/assets/icons/close.svg"
            alt="loader"
            width={20}
            height={20}
            onClick={() => setopenModal(false)}
            className="ml-2 inline-block absolute top-5 right-5 border bg-[#ff7b7d] rounded-sm cursor-pointer"
          />

          <h1 className="text-2xl">Enter OTP</h1>
          <p className="mb-8 text-sm">
            We&apos;ve sent a email to{" "}
            <span className="text-[#ff7b7d]">{email}</span>
          </p>
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value: string) => setOTP(value)}
          >
            <InputOTPGroup className="space-x-2">
              <InputOTPSlot
                index={0}
                className="w-12 h-12 text-[#ff7b7d] text-2xl rounded-sm border border-[#ff7b7d]"
              />
              <InputOTPSlot
                index={1}
                className="w-12 h-12 text-[#ff7b7d] text-2xl rounded-sm border border-[#ff7b7d]"
              />
              <InputOTPSlot
                index={2}
                className="w-12 h-12 text-[#ff7b7d] text-2xl rounded-sm border border-[#ff7b7d]"
              />
              <InputOTPSlot
                index={3}
                className="w-12 h-12 text-[#ff7b7d] text-2xl rounded-sm border border-[#ff7b7d]"
              />
              <InputOTPSlot
                index={4}
                className="w-12 h-12 text-[#ff7b7d] text-2xl rounded-sm border border-[#ff7b7d]"
              />
              <InputOTPSlot
                index={5}
                className="w-12 h-12 text-[#ff7b7d] text-2xl rounded-sm border border-[#ff7b7d]"
              />
            </InputOTPGroup>
          </InputOTP>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#fa7275] hover:bg-[#ff7b7d] text-white font-semibold py-2 rounded-lg transition cursor-pointer mt-6"
            onClick={handleOnSubmit}
          >
            Submit
            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                alt="loader"
                width={15}
                height={15}
                className="ml-2 inline-block"
              />
            )}
          </Button>
          <p className="text-[14px] mt-5">
            Didn&apos;t get the code?{" "}
            <span
              className="text-[#ff7b7d] hover:underline"
              onClick={handleOnResendCode}
            >
              click to resend
            </span>
          </p>
        </div>
      </section>
    )
  );
}

export default OTPModal;
