// components/Footer.tsx
"use client";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">Kiwiko</h3>
            <p className="mt-4 text-sm text-neutral-600 max-w-xs">
              Discover real data from real startups.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">
              Product
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              <li>
                <Link href="/how-it-works" className="hover:text-neutral-900">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/activity" className="hover:text-neutral-900">
                  Recent activity
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-neutral-900">
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">
              Resources
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              <li>
                <Link href="/resources/guides" className="hover:text-neutral-900">
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/templates"
                  className="hover:text-neutral-900"
                >
                  Templates
                </Link>
              </li>
              <li>
                <Link
                  href="/resources/metrics"
                  className="hover:text-neutral-900"
                >
                  Metrics explained
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-neutral-900">
              Company
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-neutral-600">
              <li>
                <Link href="/about" className="hover:text-neutral-900">
                  About
                </Link>
              </li>
              <li>
                <Link href="/principles" className="hover:text-neutral-900">
                  Principles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-neutral-900">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center">
          <p className="text-sm text-neutral-500">
            © {new Date().getFullYear()} Kiwiko. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-neutral-500">
            <Link href="/privacy" className="hover:text-neutral-900">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-neutral-900">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
