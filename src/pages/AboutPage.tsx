import { BadgeDollarSign, Gift, Lock, TrendingUp, Users } from "lucide-react";
import Navbar from "../components/Navbar";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <div className="bg-white dark:bg-black text-gray-900 dark:text-white">
        {/* HERO */}
        <section className="text-center py-20 px-6 bg-gray-50 dark:bg-gray-900">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-indigo-600">
            MLM PLATFORM — торговля и заработок нового поколения
          </h1>
          <p className="max-w-3xl mx-auto text-gray-600 dark:text-gray-400 text-lg">
            Косметика, мази, тарифы, ежедневные бонусы и партнёрская система —
            всё в одном месте.
          </p>
        </section>

        {/* О КОМПАНИИ */}
        <section className="py-16 px-6 max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-semibold">О нашей компании</h2>
              <p className="text-gray-700 dark:text-gray-300">
                MLM PLATFORM — это современная торговая платформа, где продаются
                косметические средства, мази и лечебные препараты. У нас вы
                можете не только покупать, но и зарабатывать.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Пользователи, оформившие ежемесячный тариф, получают бонусные
                монеты каждый день.
              </p>
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6 text-center">
              <TrendingUp className="w-10 h-10 mx-auto text-indigo-500 mb-4" />
              <p className="text-lg font-semibold">Рост и доход для каждого</p>
            </div>
          </div>
        </section>

        {/* НАША СИСТЕМА */}
        <section className="py-16 px-6 bg-gray-50 dark:bg-gray-950">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-semibold text-center mb-10">
              Как работает наша система?
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <FeatureBox
                icon={
                  <BadgeDollarSign className="w-8 h-8 mx-auto text-indigo-500" />
                }
                title="Доход через тарифы"
                text="Покупая тариф, вы ежедневно получаете бонусные токены."
              />
              <FeatureBox
                icon={<Users className="w-8 h-8 mx-auto text-indigo-500" />}
                title="Партнёрская система"
                text="Получайте 2% бонус за каждого приглашённого, купившего USDT."
              />
              <FeatureBox
                icon={<Gift className="w-8 h-8 mx-auto text-indigo-500" />}
                title="Уровни и подарки"
                text="Достигайте уровня в партнёрской сети и получайте подарки."
              />
            </div>
          </div>
        </section>

        {/* ВАЛЮТА */}
        <section className="py-16 px-6 max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-6">
            USDT — внутренняя валюта платформы
          </h2>
          <p className="text-gray-700 dark:text-gray-400 mb-4">
            Вы можете купить USDT за любую валюту или криптовалюту и
            использовать её для покупок или заработка.
          </p>
          <p className="text-gray-700 dark:text-gray-400">
            Все транзакции безопасны и обрабатываются мгновенно.
          </p>
        </section>

        {/* БЕЗОПАСНОСТЬ */}
        <section className="py-16 px-6 bg-gray-100 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1">
              <h2 className="text-3xl font-semibold mb-4">
                Гарантия безопасности
              </h2>
              <p className="text-gray-700 dark:text-gray-400 mb-2">
                Все данные пользователей защищены современными технологиями
                безопасности.
              </p>
              <p className="text-gray-700 dark:text-gray-400">
                Регистрация, вход, транзакции — всё работает под защитой.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
              <Lock className="w-10 h-10 mx-auto text-indigo-600 mb-2" />
              <p className="font-semibold">Двойной уровень защиты</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 text-center">
          <h2 className="text-2xl font-bold mb-4">
            Присоединяйтесь к нам сегодня!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-6">
            MLM PLATFORM предлагает вам не только продукты, но и настоящую
            возможность заработать.
          </p>
          <a
            href="/register"
            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
          >
            Зарегистрироваться
          </a>
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
