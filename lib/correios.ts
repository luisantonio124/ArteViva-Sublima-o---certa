export async function calcularFrete(cep: string) {
  const url = new URL(
    'https://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo'
  );
  const origem = process.env.CEP_ORIGEM || '01001000';
  url.searchParams.append('sCepOrigem', origem);
  url.searchParams.append('sCepDestino', cep);
  url.searchParams.append('nVlPeso', '1');
  url.searchParams.append('nCdFormato', '1');
  url.searchParams.append('nVlComprimento', '20');
  url.searchParams.append('nVlAltura', '5');
  url.searchParams.append('nVlLargura', '15');
  url.searchParams.append('nVlDiametro', '0');
  url.searchParams.append('sCdMaoPropria', 'n');
  url.searchParams.append('nVlValorDeclarado', '0');
  url.searchParams.append('sCdAvisoRecebimento', 'n');
  url.searchParams.append('nCdServico', '04014');
  url.searchParams.append('StrRetorno', 'xml');
  const res = await fetch(url.toString());
  const xml = await res.text();
  const valor = xml.match(/<Valor>([^<]+)<\/Valor>/)?.[1] || '0,00';
  const prazo = xml.match(/<PrazoEntrega>([^<]+)<\/PrazoEntrega>/)?.[1] || '';
  return { Valor: valor, PrazoEntrega: prazo };
}
