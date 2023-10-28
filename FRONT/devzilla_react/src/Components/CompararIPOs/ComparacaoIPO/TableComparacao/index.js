import { nubank, mobly } from "../../../../Assets/DadosExemplos/indicadores_financeiros";

export default function Table({ ofertas, ano }) {
    const oferta1 = ofertas[0];
    const oferta2 = ofertas[1];
  
    const descricaoSet = new Set([
      ...nubank
        .filter(item => item.ano == ano)
        .map(item => `${item.descricao} ${item.tipo}`),
      ...mobly
        .filter(item => item.ano == ano)
        .map(item => `${item.descricao} ${item.tipo}`)
    ]);
  
    const descricoes = Array.from(descricaoSet);
  
    return (
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>{oferta1.nome}</th>
            <th>{oferta2.nome}</th>
          </tr>
        </thead>
  
        <tbody>
          {descricoes.map(descricao => {
            const valorOferta1 = nubank.find(item => `${item.descricao} ${item.tipo}` === descricao && item.ano == ano)?.valor || '-';
            const valorOferta2 = mobly.find(item => `${item.descricao} ${item.tipo}` === descricao && item.ano == ano)?.valor || '-';
  
            return (
              <tr key={descricao}>
                <td>{descricao}</td>
                <td>{valorOferta1}</td>
                <td>{valorOferta2}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
  