import {Word} from "../app/interfaces";

export function generateWordCrosswords(palavras: Word[]) {
  const tamanho = 10;
  const tabuleiro = Array.from({ length: tamanho }, () => Array(tamanho).fill(null));
  const resultado: Word[] = [];
  
  const colocarPalavra = (palavra: string, linha: number, coluna: number, direcao: "horizontal" | "vertical", dica: string) => {
    for (let i = 0; i < palavra.length; i++) {
      const l = direcao === "horizontal" ? linha : linha + i;
      const c = direcao === "horizontal" ? coluna + i : coluna;
      tabuleiro[l][c] = palavra[i];
    }
    resultado.push({ palavra, linha, coluna, direcao, dica });
  };
  
  // Coloca a primeira palavra no centro
  const primeira = palavras[0].palavra;
  const linhaCentro = Math.floor(tamanho / 2);
  const colunaCentro = Math.floor((tamanho - primeira.length) / 2);
  colocarPalavra(primeira, linhaCentro, colunaCentro, "horizontal", palavras[0].dica);
  
  for (let i = 1; i < palavras.length; i++) {
    const atual = palavras[i].palavra;
    const dica = palavras[i].dica;
    let colocada = false;
    
    for (const colocadaAntes of resultado) {
      const { palavra: existente, linha, coluna, direcao, dica } = colocadaAntes;
      
      for (let iExistente = 0; iExistente < existente.length; iExistente++) {
        for (let iAtual = 0; iAtual < atual.length; iAtual++) {
          if (existente[iExistente] !== atual[iAtual]) continue;
          
          const l = direcao === "horizontal" ? linha - iAtual : linha + iExistente;
          const c = direcao === "horizontal" ? coluna + iExistente : coluna - iAtual;
          const novaDirecao = direcao === "horizontal" ? "vertical" : "horizontal";
          
          let podeColocar = true;
          for (let k = 0; k < atual.length; k++) {
            const li = novaDirecao === "horizontal" ? l : l + k;
            const ci = novaDirecao === "horizontal" ? c + k : c;
            const letraAtual = atual[k];
            
            if (
              li < 0 || li >= tamanho || ci < 0 || ci >= tamanho ||
              (tabuleiro[li][ci] !== null && tabuleiro[li][ci] !== letraAtual)
            ) {
              podeColocar = false;
              break;
            }
          }
          
          if (podeColocar) {
            colocarPalavra(atual, l, c, novaDirecao, dica);
            colocada = true;
            break;
          }
        }
        if (colocada) break;
      }
      if (colocada) break;
    }
    
    if (!colocada) {
      outer: for (let l = 0; l < tamanho; l++) {
        for (let c = 0; c < tamanho; c++) {
          if (c + atual.length <= tamanho) {
            let pode = true;
            for (let k = 0; k < atual.length; k++) {
              if (tabuleiro[l][c + k]) {
                pode = false;
                break;
              }
            }
            if (pode) {
              colocarPalavra(atual, l, c, "horizontal", dica);
              break outer;
            }
          }
        }
      }
    }
  }
  
  // Atualiza os objetos originais com posição e direção
  for (const item of palavras) {
    const pos = resultado.find(r => r.palavra === item.palavra);
    if (pos) {
      item.linha = pos.linha;
      item.coluna = pos.coluna;
      item.direcao = pos.direcao;
    }
  }
  
  return palavras;
}
