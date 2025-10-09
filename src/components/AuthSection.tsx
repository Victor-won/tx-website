"use client";

import { useSession, signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

export default function AuthSection() {
  const { data: session } = useSession();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <>
      {session ? (
        <>
          <span className="text-sm text-gray-600">
            {t("home.welcome", { name: session.user.name || "User" })}
          </span>
          {session.user.role === "ADMIN" && (
            <Link
              href={`/${locale}/admin`}
              className="text-sm font-medium text-blue-600 hover:text-blue-500"
            >
              {t("nav.admin")}
            </Link>
          )}
          <button
            onClick={() => signOut()}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            {t("nav.signout")}
          </button>
        </>
      ) : (
        <>
          <Link
            href={`/${locale}/auth/signin`}
            className="text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            {t("nav.signin")}
          </Link>
          <Link
            href={`/${locale}/auth/signup`}
            className="text-sm font-medium text-blue-600 hover:text-blue-500"
          >
            {t("nav.signup")}
          </Link>
        </>
      )}
    </>
  );
}
