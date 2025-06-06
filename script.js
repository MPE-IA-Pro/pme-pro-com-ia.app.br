document.addEventListener('DOMContentLoaded', function() {

    // Atualizar ano no footer
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Smooth scroll para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            if (hrefAttribute.length > 1 && hrefAttribute !== '#abrirChatDuvidas' && document.querySelector(hrefAttribute)) {
                e.preventDefault();
                document.querySelector(hrefAttribute).scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Início da Lógica do Chatbot MaxTrainer ---

    const botaoAbrirChat = document.getElementById('botaoAbrirChat');
    const janelaChat = document.getElementById('janela-chat');
    const botaoFecharChat = document.getElementById('botaoFecharChat');
    const linkAbrirChatDuvidas = document.getElementById('abrirChatDuvidas');

    const chatCorpo = document.querySelector('#janela-chat .chat-corpo');
    const chatInput = document.querySelector('#janela-chat .chat-input input');
    const chatSendButton = document.querySelector('#janela-chat .chat-input button');

    // Base de Conhecimento do MaxTrainer (foco no Catarse)
    const faqMaxTrainer = {
        "olá": "Olá! Eu sou o MaxTrainer, o agente de IA para capacitação. Como posso ajudar você a conhecer o projeto Max IA hoje?",
        "oi": "Oi! Que bom que você está aqui. Pergunte-me sobre o Max IA e nossa campanha no Catarse!",
        "tudo bem": "Tudo ótimo por aqui, pronto para te ajudar! E com você?",
        "o que é max ia": "O Max IA é seu futuro centro de comando inteligente. Ele une múltiplos agentes de IA (marketing, finanças, etc.) que aprendem com seu negócio, criando o 'algoritmo da sua empresa' para oferecer insights e soluções únicas. O objetivo é colocar você no controle, com o poder da IA.",
        "max ia": "O Max IA é um ecossistema de agentes de IA para ajudar sua PME ou agência a crescer com mais eficiência. Quer saber mais sobre algum agente específico, como o MaxMarketing ou o MaxFinanceiro?",
        "agente max": "O Agente Max é seu assistente pessoal de IA dentro da plataforma. Ele te guia, organiza as informações dos outros agentes e garante que você esteja sempre no comando.",
        "algoritmo da empresa": "O 'algoritmo da sua empresa' é nosso grande diferencial! Ele aprende continuamente com os dados e interações do SEU negócio, tornando os insights e as soluções cada vez mais personalizados e eficazes.",
        "como ajuda pme": "O Max IA ajuda PMEs em todas as frentes: 🚀 MaxMarketing cria campanhas, 💰 MaxFinanceiro cuida das finanças, ⚙️ MaxAdministrativo otimiza a gestão, e muito mais. Simplificando: mais tempo, melhores decisões e mais resultados para sua PME!",
        "para quem é": "O Max IA é ideal para Pequenas e Médias Empresas (PMEs), lojistas, empreendedores e Agências de Publicidade que buscam inovar, otimizar operações e crescer de forma inteligente.",
        "benefícios": "Os principais benefícios são: ter especialistas virtuais 24/7, otimizar seu tempo, tomar decisões baseadas em dados, e personalizar suas estratégias com o 'algoritmo da empresa', tudo com você no comando!",
        "preço": "Apoiando nosso projeto no Catarse com R$99, você garante 1 ano de acesso à versão Beta completa do Max IA e todos os seus Agentes, além de acesso ao nosso grupo exclusivo de pioneiros. É a nossa forma de agradecer aos primeiros a acreditarem no projeto!",
        "oferta": "A recompensa principal na nossa campanha do Catarse, por um apoio de R$99, inclui: 1 ano de acesso ao Max IA Beta, participação no grupo exclusivo de pioneiros e seu nome nos créditos como apoiador fundador!",
        "como participar": "É fácil! 1. Clique em qualquer botão laranja da página, como 'APOIE NO CATARSE'. 2. Você irá para nossa página no Catarse.me. 3. Lá, escolha a recompensa de R$99 e finalize seu apoio com segurança!",
        "99 reais": "Exato! Com um apoio de apenas R$99 em nossa campanha no Catarse, você garante a recompensa 'Acesso Pioneiro', que te dá um ano inteiro de acesso à versão Beta, incluindo todos os Max Agentes e participação no grupo exclusivo.",
        "apoiar": "Para apoiar, clique nos botões que te levam para a página do Catarse. Lá você encontrará todas as informações sobre o projeto e as recompensas. Seu apoio é fundamental para tirarmos esse projeto do papel!",
        "catarse": "O Catarse é a plataforma de financiamento coletivo que escolhemos para lançar o Max IA. É um ambiente seguro onde você pode apoiar nosso projeto e garantir sua recompensa de pioneiro.",
        "beta": "A versão Beta é uma fase onde a plataforma está quase pronta. Os apoiadores do Catarse serão os primeiros a usar e nos ajudar com feedback valioso para torná-la perfeita antes do lançamento oficial!",
        "chatbot": "Eu sou o MaxTrainer, um dos Max Agentes IA! Minha função aqui é te ajudar a entender tudo sobre o Max IA. Dentro da plataforma, eu ajudo a treinar equipes!",
        "obrigado": "De nada! 😊 Se tiver mais alguma dúvida, é só perguntar! Seu interesse é muito importante para nós.",
        "tchau": "Até logo! Espero te ver no nosso grupo de apoiadores pioneiros do Max IA!"
    };

    function adicionarMensagemAoChat(texto, remetente = 'user') {
        if (!chatCorpo) return;
        const p = document.createElement('p');
        p.textContent = texto;
        p.className = remetente;
        chatCorpo.appendChild(p);
        chatCorpo.scrollTop = chatCorpo.scrollHeight;
    }

    function maxTrainerResponde(mensagemUsuario) {
        const mensagemNormalizada = mensagemUsuario.toLowerCase().trim().replace(/[?.,!]/g, '');
        let respostaEncontrada = false;

        for (const palavraChave in faqMaxTrainer) {
            if (mensagemNormalizada.includes(palavraChave)) {
                adicionarMensagemAoChat(faqMaxTrainer[palavraChave], "bot");
                respostaEncontrada = true;
                break;
            }
        }

        if (!respostaEncontrada) {
            const respostasPadrao = [
                "Desculpe, não captei bem sua pergunta. Poderia tentar de outra forma? Você pode perguntar sobre 'o que é max ia', 'preço para apoiar' ou 'como funciona a campanha'.",
                "Hmm, essa é nova para mim! Que tal perguntar sobre os benefícios do Max IA ou como funciona o apoio pelo Catarse?",
                "Ainda estou aprendendo! Você pode me perguntar sobre as funções dos 'Max Agentes' ou sobre a 'recompensa de R$99'."
            ];
            const respostaAleatoria = respostasPadrao[Math.floor(Math.random() * respostasPadrao.length)];
            adicionarMensagemAoChat(respostaAleatoria, "bot");
        }
    }

    function iniciarConversaChatbot() {
        if(chatCorpo) {
            chatCorpo.innerHTML = '';
            adicionarMensagemAoChat("Olá! 👋 Sou o MaxTrainer. Em que posso te ajudar sobre nosso projeto Max IA no Catarse? (Ex: 'o que é max ia?', 'qual o valor do apoio?', 'como participar?')", "bot");
        }
    }

    function abrirChat() {
        if (janelaChat && botaoAbrirChat) {
            janelaChat.style.display = 'flex';
            botaoAbrirChat.style.display = 'none';
            iniciarConversaChatbot();
            if (chatInput) chatInput.focus();
        }
    }

    function fecharChat() {
        if (janelaChat && botaoAbrirChat) {
            janelaChat.style.display = 'none';
            botaoAbrirChat.style.display = 'flex';
        }
    }

    if (botaoAbrirChat) botaoAbrirChat.addEventListener('click', abrirChat);
    if (botaoFecharChat) botaoFecharChat.addEventListener('click', fecharChat);
    
    if (linkAbrirChatDuvidas) {
        linkAbrirChatDuvidas.addEventListener('click', function(e) {
            e.preventDefault();
            abrirChat();
        });
    }

    function enviarMensagemUsuario() {
        if (!chatInput) return;
        const mensagem = chatInput.value.trim();
        if (mensagem) {
            adicionarMensagemAoChat(mensagem, 'user');
            chatInput.value = '';
            
            setTimeout(() => {
                maxTrainerResponde(mensagem);
            }, 700);
        }
    }

    if (chatSendButton && chatInput) {
        chatSendButton.addEventListener('click', enviarMensagemUsuario);
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                enviarMensagemUsuario();
            }
        });
    }
});
