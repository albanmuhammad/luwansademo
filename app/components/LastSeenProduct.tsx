"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { fetchPersonalization } from "../../lib/salesforce/personalization";

interface RecommendedProduct {
    ssot__Id__c: string;
    ssot__Name__c: string;
    ssot__Description__c: string;
    ssot__PrimaryProductImageURL__c: string;
    ssot__ProductType__c: string; // "kamar" | "meeting"
}

export default function LastSeenProduct() {
    const [product, setProduct] = useState<RecommendedProduct | null>(null);
    const [introText, setIntroText] = useState("");

    useEffect(() => {
        fetchPersonalization<{
            personalizations: Array<{
                personalizationPointName: string;
                data: RecommendedProduct[];
                attributes: { IntroductionText?: string };
            }>;
        }>(["Last_Product_Seen"])
            .then((res) => {
                const point = res?.personalizations?.find(
                    (p) => p.personalizationPointName === "Last_Product_Seen",
                );
                const item = point?.data?.[0];
                if (item) {
                    setProduct(item);
                    setIntroText(point?.attributes?.IntroductionText ?? "");
                }
            })
            .catch((err) => {
                console.warn(
                    "[Luwansa] Gagal fetch personalisasi Last_Product_Seen, sembunyikan widget:",
                    err,
                );
            });
    }, []);

    // Individu baru/anonim yang belum pernah lihat room apa pun -> jangan tampilkan apa-apa
    if (!product) return null;

    const type = product.ssot__ProductType__c === "kamar" ? "rooms" : "meetings";
    const href = `/${type}/${product.ssot__Id__c}`;

    return (
        <div className="w-full sm:w-72 rounded-2xl border border-zinc-200 overflow-hidden bg-white shrink-0">
            <div className="relative h-40 w-full bg-zinc-100">
                <Image
                    src={product.ssot__PrimaryProductImageURL__c}
                    alt={product.ssot__Name__c}
                    fill
                    className="object-cover"
                />
            </div>
            <div className="flex flex-col gap-2 p-4">
                {introText && (
                    <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                        {introText}
                    </p>
                )}
                <h3 className="text-base font-semibold">{product.ssot__Name__c}</h3>
                <p className="text-sm text-zinc-600 line-clamp-3">
                    {product.ssot__Description__c}
                </p>
                <Link href={href} className="mt-2 text-sm font-medium text-black underline">
                    View Detail →
                </Link>
            </div>
        </div>
    );
}