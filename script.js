// PEGANDO OS ELEMENTOS DO HTML
const form = document.getElementById("form_os");
const nome = document.getElementById("nome");
const contrato = document.getElementById("contrato");
const telefone = document.getElementById("telefone");
const status = document.getElementById("status");
const busca = document.getElementById("busca");
const listaClientes = document.getElementById("lista_clientes");
const secaoFormulario = document.getElementById("secao_formulario");
const tituloFormulario = document.getElementById("titulo_formulario");
const btnCadastrar = document.getElementById("btn_cadastrar");
const btnRemover = document.getElementById("btn_remover");
const btnExportar = document.getElementById("btn_exportar");
const btnImportar = document.getElementById("btn_importar");
const arquivoBackup = document.getElementById("arquivo_backup");

// CARREGA OS CLIENTES QUE JÁ ESTÃO SALVOS
let clientes = JSON.parse(localStorage.getItem("clientes_rbi")) || [];

// MIGRA O STATUS ANTIGO "CONTATADO" PARA "RESPONDIDO" SEM GRAVAR À TOA
const precisaMigrarStatus = clientes.some(cliente => cliente.status === "contatado");

if (precisaMigrarStatus) {
    clientes = clientes.map(cliente => ({
        ...cliente,
        status: cliente.status === "contatado" ? "respondido" : cliente.status
    }));

    localStorage.setItem("clientes_rbi", JSON.stringify(clientes));
}

// GUARDA QUAL CLIENTE ESTÁ SENDO EDITADO
let clienteEditando = null;

// SALVA OS CLIENTES NO NAVEGADOR
function salvarClientes() {
    localStorage.setItem("clientes_rbi", JSON.stringify(clientes));
}

// FORMATA O STATUS PARA EXIBIÇÃO
function formatarStatus(valor) {
    const nomesStatus = {
        novo: "Novo",
        sem_resposta: "Sem Resposta",
        respondido: "Respondido",
        agendado: "Agendado",
        coletado: "Coletado",
        removido: "Removido"
    };

    return nomesStatus[valor] || valor;
}

// MOSTRA OS CLIENTES NO PAINEL
function mostrarClientes(lista = clientes) {
    listaClientes.innerHTML = "";

    lista.forEach((cliente) => {
        const div = document.createElement("div");
        div.classList.add("linha-cliente");

        div.innerHTML = `
            <span class="coluna nome-cliente">${cliente.nome}</span>
            <span class="coluna">${cliente.contrato}</span>
            <span class="coluna">${cliente.telefone}</span>
            <span class="coluna status-cliente">${formatarStatus(cliente.status)}</span>
            <span class="coluna acao-cliente">
                <button type="button" onclick="editarCliente('${cliente.id}')">Editar</button>
            </span>
        `;

        listaClientes.appendChild(div);
    });
}

// VOLTA O FORMULÁRIO PARA O MODO "NOVA OS"
function resetarFormulario() {
    clienteEditando = null;
    form.reset();

    tituloFormulario.textContent = "NOVA OS";
    btnCadastrar.textContent = "Cadastrar OS";
    btnRemover.classList.add("oculto");
}

// CADASTRAR OU ATUALIZAR UMA OS
form.addEventListener("submit", function(evento) {
    evento.preventDefault();

    const dadosCliente = {
        nome: nome.value.trim(),
        contrato: contrato.value.trim(),
        telefone: telefone.value.trim(),
        status: status.value
    };

    if (
        dadosCliente.nome === "" ||
        dadosCliente.contrato === "" ||
        dadosCliente.telefone === ""
    ) {
        alert("Preencha todos os campos.");
        return;
    }

    if (clienteEditando !== null) {
        const cliente = clientes.find(
            cliente => cliente.id === clienteEditando
        );

        if (cliente) {
            cliente.nome = dadosCliente.nome;
            cliente.contrato = dadosCliente.contrato;
            cliente.telefone = dadosCliente.telefone;
            cliente.status = dadosCliente.status;
        }
    } else {
        const novoCliente = {
            id: Date.now().toString(),
            ...dadosCliente
        };

        clientes.push(novoCliente);
    }

    salvarClientes();
    mostrarClientes();
    resetarFormulario();
});

// EDITAR UMA OS
function editarCliente(id) {
    const cliente = clientes.find(
        cliente => cliente.id === id
    );

    if (!cliente) {
        return;
    }

    nome.value = cliente.nome;
    contrato.value = cliente.contrato;
    telefone.value = cliente.telefone;
    status.value = cliente.status;

    clienteEditando = cliente.id;

    tituloFormulario.textContent = "EDITAR OS";
    btnCadastrar.textContent = "Salvar alterações";
    btnRemover.classList.remove("oculto");

    secaoFormulario.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

// REMOVER DEFINITIVAMENTE UMA OS
btnRemover.addEventListener("click", function() {
    if (clienteEditando === null) {
        return;
    }

    const cliente = clientes.find(
        cliente => cliente.id === clienteEditando
    );

    if (!cliente) {
        return;
    }

    const confirmar = confirm(
        `Deseja realmente remover a OS de ${cliente.nome}?`
    );

    if (!confirmar) {
        return;
    }

    clientes = clientes.filter(
        cliente => cliente.id !== clienteEditando
    );

    salvarClientes();
    mostrarClientes();
    resetarFormulario();
});

// BUSCAR CLIENTES
busca.addEventListener("input", function() {
    const texto = busca.value.toLowerCase().trim();

    const resultado = clientes.filter(cliente => {
        return (
            cliente.nome.toLowerCase().includes(texto) ||
            cliente.contrato.toLowerCase().includes(texto) ||
            cliente.telefone.toLowerCase().includes(texto)
        );
    });

    mostrarClientes(resultado);
});

// EXPORTAR BACKUP
btnExportar.addEventListener("click", function() {
    const backup = {
        versao: 1,
        exportadoEm: new Date().toISOString(),
        clientes: clientes
    };

    const conteudo = JSON.stringify(backup, null, 2);
    const blob = new Blob([conteudo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    const data = new Date().toISOString().slice(0, 10);

    link.href = url;
    link.download = `backup_rbi_${data}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
});

// ABRIR SELETOR DE ARQUIVO PARA IMPORTAÇÃO
btnImportar.addEventListener("click", function() {
    arquivoBackup.click();
});

// VALIDA UM REGISTRO DO BACKUP
function clienteValido(cliente) {
    return (
        cliente &&
        typeof cliente === "object" &&
        typeof cliente.id === "string" &&
        typeof cliente.nome === "string" &&
        typeof cliente.contrato === "string" &&
        typeof cliente.telefone === "string" &&
        typeof cliente.status === "string"
    );
}

// IMPORTAR BACKUP
arquivoBackup.addEventListener("change", async function() {
    const arquivo = arquivoBackup.files[0];

    if (!arquivo) return;

    try {
        const texto = await arquivo.text();
        const dados = JSON.parse(texto);

        // Aceita tanto o backup novo quanto o TXT legado recuperado do localStorage.
        const clientesImportados = Array.isArray(dados)
            ? dados
            : dados?.clientes;

        if (
            !Array.isArray(clientesImportados) ||
            !clientesImportados.every(clienteValido)
        ) {
            throw new Error("Estrutura de backup inválida.");
        }

        const normalizados = clientesImportados.map(cliente => ({
            ...cliente,
            status: cliente.status === "contatado" ? "respondido" : cliente.status
        }));

        const confirmar = confirm(
            `Importar ${normalizados.length} registros?\n\n` +
            `A base atual com ${clientes.length} registros será substituída.`
        );

        if (!confirmar) return;

        clientes = normalizados;
        salvarClientes();
        mostrarClientes();
        resetarFormulario();

        alert(`Backup importado com sucesso: ${clientes.length} registros.`);
    } catch (erro) {
        alert("Não foi possível importar este arquivo. Verifique se é um backup válido do Controle RBI.");
    } finally {
        arquivoBackup.value = "";
    }
});

// MOSTRA OS CLIENTES ASSIM QUE A PÁGINA ABRIR
mostrarClientes();
