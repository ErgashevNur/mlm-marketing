import { BadgeDollarSign, Gift, TrendingUp, Users } from "lucide-react";
import { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  const { i18n } = useTranslation();
  const [informations, setInformations] = useState(null);
  const getAboutInformations = async () => {
    await fetch(`${import.meta.env.VITE_API_KEY}/about`)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setInformations(res);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {});
  };

  useEffect(() => {
    getAboutInformations();
  }, []);

  return (
    <>
      <Navbar />
      <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* HERO */}
        <section className="text-center py-20 px-6 bg-gray-50 dark:bg-gray-900">
          {informations?.aboutTranslation.map((info) => {
            if (info.language === i18n.language) {
              return (
                <Fragment key={info.id}>
                  <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-600">
                    {info.heroTitle}
                  </h1>
                  <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
                    {info.heroDescription}
                  </p>
                </Fragment>
              );
            }
          })}
        </section>

        {/* О КОМПАНИИ */}
        <section className="py-16  px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            {informations?.aboutTranslation.map((info) => {
              if (info.language === i18n.language) {
                return (
                  <Fragment key={info.id}>
                    <div className="space-y-4">
                      <h2 className="text-3xl font-semibold">
                        {info.aboutCompanyTitle}
                      </h2>
                      <p className="text-gray-700 dark:text-gray-300">
                        {info.aboutCompanyDescription}
                      </p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center">
                      <TrendingUp className="w-10 h-10 mx-auto text-indigo-500 mb-4" />
                      <p className="text-lg font-semibold">
                        {info.aboutCompanyExpence}
                      </p>
                    </div>
                  </Fragment>
                );
              }
            })}
          </div>
        </section>

        {/* НАША СИСТЕМА */}
        <section className="py-16 px-6 bg-gray-50 dark:bg-gray-950">
          {informations?.aboutTranslation.map((info) => {
            if (info.language === i18n.language) {
              return (
                <div className="max-w-6xl mx-auto" key={info.id}>
                  <h2 className="text-3xl font-semibold text-center mb-10">
                    {info.howWorkSystem}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6 text-center">
                    <FeatureBox
                      icon={
                        <BadgeDollarSign className="w-8 h-8 mx-auto text-indigo-500" />
                      }
                      title={info.withPlansTitle}
                      text={info.withPlansDescription}
                    />
                    <FeatureBox
                      icon={
                        <Users className="w-8 h-8 mx-auto text-indigo-500" />
                      }
                      title={info.referalTitle}
                      text={info.referalDescription}
                    />
                    <FeatureBox
                      icon={
                        <Gift className="w-8 h-8 mx-auto text-indigo-500" />
                      }
                      title={info.levelTitle}
                      text={info.levelDescription}
                    />
                  </div>
                </div>
              );
            }
          })}
        </section>

        {/* ВАЛЮТА */}
        <section className="py-16 px-6 max-w-5xl mx-auto text-center">
          {informations?.aboutTranslation.map((info) => {
            if (info.language === i18n.language) {
              return (
                <Fragment key={info.id}>
                  <h2 className="text-3xl font-semibold mb-6">
                    {info.USDTTitle}
                  </h2>
                  <p className="text-gray-700 dark:text-gray-400 mb-4">
                    {info.USDTDescription}
                  </p>
                </Fragment>
              );
            }
          })}
        </section>
      </div>
    </>
  );
}

function FeatureBox({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <>
      <div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all">
          <div className="mb-4">{icon}</div>
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">{text}</p>
        </div>
      </div>
    </>
  );
}
