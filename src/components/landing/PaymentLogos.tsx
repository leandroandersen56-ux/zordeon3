import pixIcon from "@/assets/logos/pix-icon.svg";
import visaIcon from "@/assets/logos/visa-icon.svg";
import mastercardIcon from "@/assets/logos/mastercard-icon.svg";
import amexIcon from "@/assets/logos/amex-icon.svg";
import hipercardIcon from "@/assets/logos/hipercard-icon.svg";
import boletoIcon from "@/assets/logos/boleto-icon.svg";
import eloIcon from "@/assets/logos/elo-icon.png";

const logos = [
  { name: "Pix", src: pixIcon, h: "h-5" },
  { name: "Visa", src: visaIcon, h: "h-12" },
  { name: "Mastercard", src: mastercardIcon, h: "h-8" },
  { name: "Amex", src: boletoIcon, h: "h-6" },
  { name: "Elo", src: eloIcon, h: "h-5" },
  { name: "Hipercard", src: hipercardIcon, h: "h-5" },
];

export function PaymentLogoGrid() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {logos.map((logo) => (
        <div
          key={logo.name}
          className="rounded-lg bg-[hsl(230,20%,8%)] border border-[hsl(0,0%,100%)]/[0.06] h-12 flex items-center justify-center px-3"
        >
          {logo.src ? (
            <img
              src={logo.src}
              alt={logo.name}
              className={`${logo.h} w-auto object-contain opacity-50 brightness-0 invert`}
            />
          ) : (
            <span className="text-[hsl(0,0%,45%)] text-[11px] font-bold tracking-wide">
              {logo.name === "Elo" ? (
                <span className="text-xl font-extrabold italic">elo</span>
              ) : (
                <span className="uppercase">{logo.name}</span>
              )}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
