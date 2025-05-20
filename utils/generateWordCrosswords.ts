import {Word} from "../app/interfaces";

export function generateWordCrosswords(words: Word[]) {
  const tamanho = 10;
  const tabuleiro = Array.from({ length: tamanho }, () => Array(tamanho).fill(null));
  const resultado: Word[] = [];
  
  const colocarPalavra = (word: string, row: number, column: number, direction: "horizontal" | "vertical", tip: string) => {
    for (let i = 0; i < word.length; i++) {
      const l = direction === "horizontal" ? row : row + i;
      const c = direction === "horizontal" ? column + i : column;
      tabuleiro[l][c] = word[i];
    }
    resultado.push({ word, row, column, direction, tip });
  };
  
  // Coloca a primeira word no centro
  const primeira = words[0].word;
  const linhaCentro = Math.floor(tamanho / 2);
  const colunaCentro = Math.floor((tamanho - primeira.length) / 2);
  colocarPalavra(primeira, linhaCentro, colunaCentro, "horizontal", words[0].tip);
  
  for (let i = 1; i < words.length; i++) {
    const atual = words[i].word;
    const tip = words[i].tip;
    let colocada = false;
    
    for (const colocadaAntes of resultado) {
      const { word: existente, row, column, direction, tip } = colocadaAntes;
      
      for (let iExistente = 0; iExistente < existente.length; iExistente++) {
        for (let iAtual = 0; iAtual < atual.length; iAtual++) {
          if (existente[iExistente] !== atual[iAtual]) continue;
          
          const l = direction === "horizontal" ? row - iAtual : row + iExistente;
          const c = direction === "horizontal" ? column + iExistente : column - iAtual;
          const novaDirecao = direction === "horizontal" ? "vertical" : "horizontal";
          
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
            colocarPalavra(atual, l, c, novaDirecao, tip);
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
              colocarPalavra(atual, l, c, "horizontal", tip);
              break outer;
            }
          }
        }
      }
    }
  }
  
  // Atualiza os objetos originais com posição e direção
  for (const item of words) {
    const pos = resultado.find(r => r.word === item.word);
    if (pos) {
      item.row = pos.row;
      item.column = pos.column;
      item.direction = pos.direction;
    }
  }
  
  return words;
}
