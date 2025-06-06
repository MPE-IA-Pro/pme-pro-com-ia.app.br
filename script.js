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

    // NOVA Base de Conhecimento do MaxTrainer (Foco: Crowdfunding e Explicação do Projeto)
    const faqMaxTrainer = {
        // Saudações
        "olá": "Olá! Eu sou o MaxTrainer, a IA de treinamento do Max IA. Como posso te ajudar a entender nosso projeto e a campanha no Catarse?",
        "oi": "Oi! Que bom ver você por aqui. Fique à vontade para perguntar tudo sobre o Max IA!",
        "tudo bem": "Tudo ótimo, e pronto para te ajudar a revolucionar sua gestão! E com você?",

        // Sobre o Max IA (Novos Conceitos)
        "o que é max ia": "O Max IA é o seu centro de comando inteligente, um app empresarial exclusivo que ativa o 'algoritmo da sua empresa'. Ele é liderado pelo Agente Max e reúne um time de IAs especialistas (os Max Agentes) para otimizar marketing, finanças, gestão e muito mais!",
        "max ia": "O Max IA é uma plataforma com múltiplos agentes de IA que trabalham juntos para sua PME ou agência. Ele aprende com seu negócio e te dá superpoderes para tomar as melhores decisões. Quer saber sobre algum agente específico?",
        "agente max": "O Agente Max é seu assistente pessoal de IA dentro da plataforma. Ele é o maestro que coordena todos os outros Max Agentes, traduz os dados em insights fáceis de entender e garante que você esteja sempre no comando.",
        "algoritmo da empresa": "O 'algoritmo da sua empresa' é a alma do Max IA! É um sistema que aprende continuamente com os dados, interações e resultados do SEU negócio. Isso torna as soluções e os insights ultra personalizados e cada vez mais inteligentes.",

        // Campanha de Crowdfunding (Catarse)
        "catarse": "O Catarse é a plataforma de financiamento coletivo que escolhemos para lançar o Max IA. Através dela, você pode apoiar nosso projeto e, em troca, receber recompensas incríveis, como o acesso de 1 ano ao app por R$99.",
        "crowdfunding": "Nossa campanha de crowdfunding (financiamento coletivo) no Catarse é a forma que encontramos de construir esse projeto junto com nossos futuros usuários. Seu apoio é fundamental para o desenvolvimento e você ainda garante acesso antecipado e com valor especial.",
        "apoiar": "Para apoiar é simples: clique nos botões 'APOIE O PROJETO' na página. Você será direcionado para nossa campanha no Catarse. Lá, é só escolher a recompensa de R$99 e seguir os passos para confirmar.",
        "como apoiar": "É fácil! 1. Clique nos botões de apoio para ir ao Catarse. 2. Escolha a recompensa de 'Acesso Beta por 1 Ano'. 3. Finalize o pagamento na plataforma. Pronto, você se tornou um pioneiro do Max IA!",
        
        // Oferta / Recompensa
        "preço": "O apoio para garantir a recompensa principal é de apenas R$99. Com esse valor, você garante UM ANO de acesso à versão Beta completa do Max IA e todos os seus Agentes. É um valor simbólico para nossos apoiadores pioneiros!",
        "99 reais": "Exato! Com um apoio único de R$99 na nossa campanha do Catarse, você ganha a recompensa de 1 ano de acesso completo ao Max IA Beta. É a nossa forma de agradecer quem acredita no projeto desde o início.",
        "oferta": "A recompensa principal para apoiadores no Catarse é o acesso de 1 ano ao Max IA Beta, com todos os Max Agentes inclusos, por apenas R$99. É a sua chance de ser pioneiro e ajudar a moldar a ferramenta.",
        "recompensa": "A recompensa principal é o acesso de 1 ano ao Max IA Beta por R$99. Ao nos apoiar, você garante o uso da plataforma assim que ela for lançada para os apoiadores.",
        
        // Público e Benefícios
        "para quem é": "O Max IA foi desenhado para donos de Pequenas e Médias Empresas (PMEs), empreendedores, lojistas e também para Agências de Publicidade e Marketing que desejam otimizar suas operações e de seus clientes.",
        "benefícios": "Os principais benefícios são: ter uma equipe de especialistas virtuais 24/7, economizar tempo e dinheiro, tomar decisões baseadas em dados personalizados do seu negócio e, o mais importante, ter o controle total para crescer de forma inteligente.",
        "beta": "A versão Beta é uma fase de pré-lançamento. A plataforma está funcional e pronta para uso, mas contamos com o feedback dos nossos apoiadores pioneiros (como você!) para refinar detalhes e adicionar novas funcionalidades. Sua opinião será muito valiosa!",

        // Despedidas e Agradecimentos
        "obrigado": "Eu que agradeço o interesse! Se precisar de mais algo, é só chamar. Esperamos ter você como nosso apoiador!",
        "tchau": "Até mais! Qualquer outra dúvida, estou por aqui. Não perca a chance de fazer parte do futuro da gestão!"
    };

    // Função para adicionar mensagens na interface do chat
    function adicionarMensagemAoChat(texto, remetente = 'user') {
        if (!chatCorpo) return;
        const p = document.createElement('p');
        p.textContent = texto;
        p.className = remetente; // Adiciona classe 'user' ou 'bot'
        chatCorpo.appendChild(p);
        chatCorpo.scrollTop = chatCorpo.scrollHeight; // Auto-scroll
    }

    // Função principal para o MaxTrainer responder
    function maxTrainerResponde(mensagemUsuario) {
        const mensagemNormalizada = mensagemUsuario.toLowerCase().trim().replace(/[?]/g, '');
        let respostaEncontrada = false;

        // Procura pela melhor correspondência na base de conhecimento
        let melhorCorrespondecia = '';
        let maiorContagem = 0;

        for (const palavraChave in faqMaxTrainer) {
            if (mensagemNormalizada.includes(palavraChave)) {
                // Dá prioridade para correspondências mais longas/específicas
                if (palavraChave.length > maiorContagem) {
                    maiorContagem = palavraChave.length;
                    melhorCorrespondecia = faqMaxTrainer[palavraChave];
                    respostaEncontrada = true;
                }
            }
        }
        
        if (respostaEncontrada) {
             adicionarMensagemAoChat(melhorCorrespondecia, "bot");
        } else {
             // Respostas padrão para quando não entende
            const respostasPadrao = [
                "Desculpe, não captei bem sua pergunta. Poderia tentar de outra forma? Você pode perguntar sobre 'o que é max ia', 'como apoiar no catarse' ou 'qual a recompensa'.",
                "Hmm, essa é nova para mim! Que tal perguntar sobre os benefícios do Max IA ou como funciona a campanha de financiamento coletivo?",
                "Ainda estou aprendendo! Você pode me perguntar sobre as funcionalidades dos 'Max Agentes' ou sobre o valor do apoio de R$99."
            ];
            const respostaAleatoria = respostasPadrao[Math.floor(Math.random() * respostasPadrao.length)];
            adicionarMensagemAoChat(respostaAleatoria, "bot");
        }
    }

    // Função para limpar o corpo do chat e adicionar saudação inicial do bot
    function iniciarConversaChatbot() {
        if(chatCorpo) {
            chatCorpo.innerHTML = ''; // Limpa mensagens anteriores
            adicionarMensagemAoChat("Olá! 👋 Sou o MaxTrainer. Estou aqui para tirar suas dúvidas sobre o projeto Max IA e nossa campanha no Catarse. Pode perguntar! (Ex: 'o que é max ia?', 'como apoiar?', 'qual o preço?')", "bot");
        }
    }

    // Lógica para abrir e fechar o chat
    function abrirChat() {
        if (janelaChat) {
            janelaChat.style.display = 'flex';
            iniciarConversaChatbot();
            if (chatInput) chatInput.focus();
        }
    }

    function fecharChat() {
        if (janelaChat) {
            janelaChat.style.display = 'none';
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

    // Event listener para enviar mensagem (botão e Enter)
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
    // --- Fim da Lógica do Chatbot MaxTrainer ---
});
