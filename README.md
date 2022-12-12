# Progetto TIW-2022 Politecnico di Milano

## Versione con <u>JavaScript</u>
Si realizzi un’applicazione client server web che modifica le specifiche della versione HTML come segue:
* La registrazione controlla la validità sintattica dell’indirizzo di email e l’uguaglianza tra i campi “password” e “ripeti password” anche a lato client.
* Dopo il login dell’utente, l’intera applicazione è realizzata con un’unica pagina.
* Ogni interazione dell’utente è gestita senza ricaricare completamente la pagina, ma produce l’invocazione asincrona del server e l’eventuale modifica del contenuto da aggiornare a seguito dell’evento.
* L’evento di visualizzazione del blocco precedente/successivo d’immagini di un album è gestito a lato client senza generare una richiesta al server.
* Quando l’utente passa con il mouse su una miniatura, l’applicazione mostra una finestra modale con tutte le informazioni dell’immagine, tra cui la stessa a grandezza naturale, i commenti eventualmente presenti e la form per inserire un commento.
* L’applicazione controlla anche a lato client che non si invii un commento vuoto.
* Errori a lato server devono essere segnalati mediante un messaggio di allerta all’interno della pagina.
* Si deve consentire all’utente di riordinare l’elenco dei propri album con un criterio
diverso da quello di default (data decrescente). L’utente trascina il titolo di un album nell’elenco e lo colloca in una posizione diversa per realizzare l’ordinamento che desidera, senza invocare il server. Quando l’utente ha raggiunto l’ordinamento desiderato, usa un bottone “salva ordinamento”, per memorizzare la sequenza sul server. Ai successivi accessi, l’ordinamento personalizzato è usato al posto di quello di default.
