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

    // Base de Conhecimento do MaxTrainer (FAQ e informações)
    // Você pode expandir muito esta seção!
    const faqMaxTrainer = {
        // Saudações e introdução
        "olá": "Olá! Eu sou o MaxTrainer, seu assistente IA. Como posso ajudar você a conhecer o Max IA hoje?",
        "oi": "Oi! Que bom que você está aqui. Pergunte-me sobre o Max IA!",
        "tudo bem": "Tudo ótimo por aqui, pronto para te ajudar! E com você?",

        // Sobre o Max IA
        "o que é max ia": "O Max IA é o seu centro de comando inteligente, com o 'Agente Max' e 'Max Agentes IA' especializados. Ele simplifica a complexidade dos negócios, oferece insights personalizados com o 'algoritmo da sua empresa' em aprendizado contínuo, e capacita você a tomar as melhores decisões – tudo isso com você no comando!",
        "max ia": "O Max IA é uma plataforma revolucionária com múltiplos agentes de IA para ajudar sua PME ou agência a crescer e ser mais eficiente. Quer saber mais sobre algum benefício específico?",
        "agente max": "O Agente Max é seu assistente pessoal de IA dentro da plataforma Max IA. Ele te guia, organiza as informações dos outros agentes e garante que você esteja sempre no controle.",
        "algoritmo da empresa": "O 'algoritmo da sua empresa' é uma característica única do Max IA! Ele aprende continuamente com os dados e interações do SEU negócio, tornando os insights e as soluções cada vez mais personalizados e eficazes.",

        // Benefícios e Utilidades para PMEs
        "como ajuda pme": "O Max IA ajuda PMEs em diversas áreas: 🚀 MaxMarketing Total cria campanhas e analisa público, 💰 MaxFinanceiro cuida das finanças, ⚙️ MaxAdministrativo otimiza a gestão, 📊 MaxPesquisa de Mercado traz insights valiosos, 🧭 MaxBússola Estratégica auxilia no planejamento e 🎓 MaxTrainer IA (eu mesmo!) capacita sua equipe. Simplificando: mais tempo, melhores decisões e mais resultados para sua PME!",
        "para quem é": "O Max IA é ideal para Pequenas e Médias Empresas (PMEs) de todos os setores, incluindo varejistas e lojistas, além de Agências de Publicidade e Marketing e empreendedores que buscam inovação e eficiência.",
        "benefícios": "Os principais benefícios são: ter especialistas virtuais 24/7, otimizar seu tempo, tomar decisões baseadas em dados, personalizar suas estratégias com o 'algoritmo da empresa', e tudo isso com uma interface intuitiva e você no comando!",

        // Oferta de Lançamento
        "preço": "No nosso lançamento exclusivo, você garante UM ANO de acesso à versão Beta completa do Max IA e todos os seus Agentes por um investimento único de APENAS R$99,00! É uma oferta imperdível.",
        "oferta": "A oferta de lançamento inclui: 1 ano de acesso ao Max IA Beta, participação em grupo exclusivo para feedback e networking, e atualizações em primeira mão. Tudo por R$99!",
        "como participar": "É simples! 1. Clique no botão 'QUERO FAZER PARTE DO GRUPO EXCLUSIVO!' ou 'SIM, QUERO MEU ACESSO DE 1 ANO...'. 2. Faça sua inscrição no Sympla por R$99. 3. Você receberá o acesso ao grupo e as instruções para o Max IA!",
        "99 reais": "Exato! Apenas R$99 por um ano inteiro de acesso à versão Beta, incluindo todos os Max Agentes e participação no grupo exclusivo. É um valor promocional de lançamento para nossos pioneiros.",
        "garantir acesso": "Para garantir seu acesso, clique em qualquer um dos botões de CTA laranja na página, como 'GARANTIR MEU ACESSO DE 1 ANO POR R$99!'. Eles te levarão para a página de inscrição no Sympla.",

        // Dúvidas Gerais
        "beta": "A versão Beta é uma fase onde a plataforma está quase pronta, mas ainda estamos coletando feedback dos primeiros usuários (como você!) para torná-la ainda melhor. Seu feedback será muito valioso!",
        "chatbot": "Eu sou o MaxTrainer, um dos Max Agentes IA! Estou aqui para te ajudar a entender tudo sobre o Max IA e como ele pode revolucionar seu negócio.",
        "obrigado": "De nada! 😊 Se tiver mais alguma dúvida, é só perguntar!",
        "tchau": "Até logo! Espero te ver no nosso grupo exclusivo do Max IA!"
        // Adicione mais perguntas frequentes e suas respostas aqui.
        // Use palavras-chave que seus clientes provavelmente usariam.
    };

    // Função para adicionar mensagens na interface do chat
    function adicionarMensagemAoChat(texto, remetente = 'user') {
        if (!chatCorpo) return;
        const p = document.createElement('p');
        p.textContent = texto;
        p.className = remetente; // Adiciona classe 'user' ou 'bot'
        chatCorpo.appendChild(p);
        chatCorpo.scrollTop = chatCorpo.scrollHeight; // Auto-scroll para a última mensagem
    }

    // Função principal para o MaxTrainer responder
    function maxTrainerResponde(mensagemUsuario) {
        const mensagemNormalizada = mensagemUsuario.toLowerCase().trim();
        let respostaEncontrada = false;

        // Tenta encontrar uma correspondência exata ou parcial na base de conhecimento
        for (const palavraChave in faqMaxTrainer) {
            // Verifica se a mensagem do usuário CONTÉM alguma palavra-chave do FAQ
            if (mensagemNormalizada.includes(palavraChave)) {
                adicionarMensagemAoChat(faqMaxTrainer[palavraChave], "bot");
                respostaEncontrada = true;
                break; // Para na primeira correspondência encontrada
            }
        }

        // Se nenhuma resposta foi encontrada
        if (!respostaEncontrada) {
            // Respostas padrão para quando não entende
            const respostasPadrao = [
                "Desculpe, não captei bem sua pergunta. Poderia tentar de outra forma ou usar outras palavras? Você pode perguntar sobre 'o que é max ia', 'preço da oferta' ou 'como ele ajuda pme'.",
                "Hmm, essa é nova para mim! Que tal perguntar sobre os benefícios do Max IA ou como funciona a oferta de lançamento?",
                "Ainda estou aprendendo! Você pode me perguntar sobre as funcionalidades dos 'Max Agentes' ou o 'preço promocional'."
            ];
            const respostaAleatoria = respostasPadrao[Math.floor(Math.random() * respostasPadrao.length)];
            adicionarMensagemAoChat(respostaAleatoria, "bot");
        }
    }

    // Função para limpar o corpo do chat e adicionar saudação inicial do bot
    function iniciarConversaChatbot() {
        if(chatCorpo) {
            chatCorpo.innerHTML = ''; // Limpa mensagens anteriores
            adicionarMensagemAoChat("Olá! Sou o MaxTrainer, seu assistente IA. 👋 Em que posso te ajudar sobre o Max IA hoje? (Ex: 'o que é max ia?', 'qual o preço?', 'como ajuda pme?')", "bot");
        }
    }

    // Lógica para abrir e fechar o chat
    function abrirChat() {
        if (janelaChat) {
            janelaChat.style.display = 'flex';
            iniciarConversaChatbot(); // Adiciona saudação inicial
            if (chatInput) chatInput.focus(); // Foca no campo de input
        }
    }

    function fecharChat() {
        if (janelaChat) {
            janelaChat.style.display = 'none';
        }
    }

    if (botaoAbrirChat) {
        botaoAbrirChat.addEventListener('click', abrirChat);
    }

    if (botaoFecharChat) {
        botaoFecharChat.addEventListener('click', fecharChat);
    }

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
            chatInput.value = ''; // Limpa o campo de input
            
            // Adiciona um pequeno delay para simular o "pensamento" do bot
            setTimeout(() => {
                maxTrainerResponde(mensagem);
            }, 700); // 700 milissegundos = 0.7 segundos
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