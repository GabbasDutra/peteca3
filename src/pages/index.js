import Head from 'next/head';
import { useState, useMemo } from 'react';
import useSWR from 'swr';
import styles from '../styles/Home.module.css';

const fetcher = url => fetch(url).then(res => res.json());

export default function Home() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data, error, isLoading } = useSWR(
    'https://economia.awesomeapi.com.br/json/daily/BTC-BRL/30',
    fetcher,
    { refreshInterval: 10000 }
  );

  const filteredData = useMemo(() => {
    if (!data || !startDate || !endDate) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);

    return data.filter(entry => {
      const entryDate = new Date(Number(entry.timestamp) * 1000);
      return entryDate >= start && entryDate <= end;
    });
  }, [data, startDate, endDate]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Minha Página com Next.js</title>
        <meta name="description" content="Exemplo com cotação de Bitcoin filtrada por data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Cotação BTC/BRL</h1>

        <div className={styles.description}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            <label>
              Início:
              <input className="dateInput" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </label>
            <label>
              Fim:
              <input className="dateInput" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
            </label>
          </div>
        </div>

        {error && <p className={styles.description}>Erro ao carregar cotação.</p>}
        {isLoading && <p className={styles.description}>Carregando cotação...</p>}

        {filteredData.length > 0 ? (
          <div>
            {filteredData.map((entry, index) => (
              <div key={index} className={styles.card}>
                <h3>{new Date(Number(entry.timestamp) * 1000).toLocaleDateString()}</h3>
                <p><strong>Compra:</strong> R$ {entry.bid}</p>
                <p><strong>Venda:</strong> R$ {entry.ask}</p>
                <p><strong>Alta:</strong> R$ {entry.high}</p>
                <p><strong>Baixa:</strong> R$ {entry.low}</p>
                <p><strong>Variação:</strong> {entry.varBid} ({entry.pctChange}%)</p>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.description}>Selecione uma época existente.</p>
        )}
      </main>

      <footer className={styles.footer}>
        
      </footer>
    </div>
  );
}
