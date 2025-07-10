import useSWR from 'swr';
import { fetcher } from '../lib/fetcher';

export default function Home() {
  const { data, error, isLoading } = useSWR(
    'https://economia.awesomeapi.com.br/json/last/BTC-BRL?token=927c456f9a4bec44887e5cc0e2d154c8f843f33855ec2ec0d15db596ee7d19cd',
    fetcher,
    { refreshInterval: 5000 } 
  );

  if (error) return <div>Erro ao carregar dados.</div>;
  if (isLoading || !data) return <div>Carregando...</div>;

  const btcbrl = data.BTCBRL;

  return (
    <main style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Cotação Bitcoin Hoje (BTC/BRL)</h1>
      <p><strong>Compra:</strong> R$ {btcbrl.bid}</p>
      <p><strong>Venda:</strong> R$ {btcbrl.ask}</p>
      <p><strong>Alta:</strong> R$ {btcbrl.high}</p>
      <p><strong>Baixa:</strong> R$ {btcbrl.low}</p>
      <p><strong>Variação:</strong> {btcbrl.varBid} ({btcbrl.pctChange}%)</p>
      <small>Atualizado: {new Date(Number(btcbrl.timestamp) * 1000).toLocaleString()}</small>
    </main>
  );
}
