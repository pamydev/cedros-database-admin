[ok] Fazer o find e findOne saberem quais fields estao disponiveis.
[ok] as suggestions de fields tem que aparecer antes do usuario digitar qualquer coisa
[ok] bug de substituir profile com "fi" do find, corrigido com callback de replace com grupos de captura
[ok] box no topo da janela, resolvido inserindo um span fantasma antes da medicao da posicao do cursor.
[ok] quando eu escolho uma field apenas com arrow, o tab desaparece. corrigido expondo tabCount para adicionar a quantidade correta de tabs.
[ok] as suggestions de fields precisa ser disparada em cada field

[ok] mostrar fields suggestions completo com campo em branco

[ok] erro arrow para selecionar suggestions fields esta colocando a suggestion no lugar errado
resolvido com

```javascript
if (text.endsWith("\n")) {
  text = text.slice(0, -1);
}
```

[] poder escolher a suggestion com o click do mouse
[] fazer tudo funcionar tambem com aspas simples
[] o esc deve fechar a suggestion box
[] implementar fields tambem em outras operacoes
[] testar com varias fields o comportamento
