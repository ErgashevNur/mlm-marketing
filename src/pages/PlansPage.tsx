import { useTranslation } from "react-i18next";
import {
  Star,
  CoinsIcon,
  Coins,
  Calendar,
  Pen,
  LanguagesIcon,
  User,
  PointerOffIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const PlansPage: React.FC = () => {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState();

  useEffect(() => {
    const getPlans = async () => {
      const req = await fetch("https://mlm-backend.pixl.uz/tariff");
      if (req.status === 200) {
        const res = await req.json();
        setPlans(res);
      } else {
        throw new Error(req.message || "Fetchda xatolik");
      }
    };
    getPlans();
  }, []);

  const buyPlan = async (id) => {
    const token = localStorage.getItem("token");

    const order = {
      tariff_id: id,
    };

    const req = await fetch("https://mlm-backend.pixl.uz/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(order),
    });

    if (req.status === 200) {
      const res = await req.json();
      console.log(res);
      alert("Sotib olindi!");
    } else {
      const err = await req.text();
      console.error(err);
      throw new Error(err || "Xatolik mavjud");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t("plans.choosePlan")}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Choose the perfect plan for your marketing needs. All plans include
            our core features with different limits and bonuses.
          </p>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans &&
          plans.map(
            ({
              coin,
              createdAt,
              dailyProfit,
              id,
              photo_url,
              referral_bonus,
              term,
              translations,
            }) => {
              return (
                <div
                  key={id}
                  className="w-[400px] overflow-hidden min-h-[500px] border-2 border-blue-700 h-auto rounded-lg bg-white"
                >
                  <img
                    className="w-full h-60 object-cover mb-3"
                    src={photo_url}
                    alt="image"
                  />
                  <div className="p-4 flex flex-col gap-2">
                    <p className="flex items-center gap-2 text-2xl mb-4">
                      <span className="font-bold text-2xl">DailyProfit:</span>
                      <span className="font-bold">{dailyProfit}</span>{" "}
                      <CoinsIcon className="text-yellow-400" />
                    </p>
                    <p className="flex items-center gap-2">
                      <b>Coin:</b> {coin} <Coins className="text-yellow-400" />
                    </p>
                    <p className="flex items-center gap-2">
                      <b>Referaldan olinadigan bonus:</b> {referral_bonus}{" "}
                      <Coins className="text-yellow-400" />
                    </p>
                    <p className="flex items-center gap-2">
                      <b>Term:</b> {term} <Coins className="text-yellow-400" />
                    </p>
                    <p className="flex items-center gap-2">
                      <b>Muddati: </b>
                      {new Date(createdAt).toLocaleDateString("uz-UZ")}
                      <Calendar className="w-4 h-5 text-red-700" />
                    </p>
                    {translations?.map(
                      ({
                        description,
                        features,
                        id,
                        language,
                        longDescription,
                        name,
                        usage,
                      }) => {
                        return (
                          <div className="flex flex-col gap-2" key={id}>
                            <p className="flex items-center gap-2">
                              <b>Description: </b>
                              {description}
                              <Pen className="w-3 h-3 text-yellow-500" />
                            </p>
                            <p className="flex items-center gap-2">
                              <b>Features: </b>
                              {features}{" "}
                              <Star className="w-3 h-3 text-blue-800" />
                            </p>
                            <p className="flex items-center gap-2">
                              <b>Language: </b>
                              {language} <LanguagesIcon className="w-4 h-4" />
                            </p>
                            <p className="flex items-center gap-2">
                              <b>LongDescription: </b>
                              {longDescription}
                              <Pen className="w-3 h-3 text-yellow-500" />
                            </p>
                            <p className="flex items-center gap-2">
                              <b>Name: </b>
                              {name} <User className="w-4 h-4" />
                            </p>
                            <p className="flex items-center gap-2">
                              <b>Usage: </b>
                              {usage} <PointerOffIcon className="w-3 h-4" />
                            </p>
                          </div>
                        );
                      }
                    )}
                    <button
                      onClick={() => buyPlan(id)}
                      className="w-full hover:bg-blue-700 duration-300 hover:text-white text-black my-5 border py-2 rounded-xl"
                    >
                      Select plan
                    </button>
                  </div>
                </div>
              );
            }
          )}
      </div>
    </div>
  );
};

export default PlansPage;