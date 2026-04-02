// carregar posts
function carregarFeed() {
    let feed = document.getElementById("feed");
    if (!feed) return;

    feed.innerHTML = "";

    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    posts.reverse().forEach((post, index) => {
        let div = document.createElement("div");
        div.classList.add("post");

        let comentariosHTML = "";
        post.comentarios.forEach(c => {
            comentariosHTML += `<p><b>${c.nome}:</b> ${c.texto}</p>`;
        });

        div.innerHTML = `
            <div class="nome">@${post.nome}</div>
            <div>${post.mensagem}</div>
            ${post.imagem ? `<img src="${post.imagem}">` : ""}

            <div class="actions">
    <span onclick="curtir(${index})">❤️ ${post.likes}</span>
    <span onclick="excluirPost(${index})">🗑️</span>
</div>

            <div class="comentarios">
                ${comentariosHTML}
                <input type="text" placeholder="Comentar..." onkeydown="comentar(event, ${index})">
            </div>
        `;

        feed.appendChild(div);
    });
}

// criar post
document.getElementById("formPost")?.addEventListener("submit", function(e) {
    e.preventDefault();

    let nome = document.getElementById("nome").value;
    let mensagem = document.getElementById("mensagem").value;
    let imagemInput = document.getElementById("imagem");

    let reader = new FileReader();

    reader.onload = function() {
        let posts = JSON.parse(localStorage.getItem("posts")) || [];

        posts.push({
            nome,
            mensagem,
            imagem: reader.result || "",
            likes: 0,
            comentarios: []
        });

        localStorage.setItem("posts", JSON.stringify(posts));

        carregarFeed();
    };

    if (imagemInput.files[0]) {
        reader.readAsDataURL(imagemInput.files[0]);
    } else {
        reader.onload();
    }

    document.getElementById("formPost").reset();
});

// curtir
function curtir(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts[posts.length - 1 - index].likes++;
    localStorage.setItem("posts", JSON.stringify(posts));
    carregarFeed();
}

// comentar
function comentar(event, index) {
    if (event.key === "Enter") {
        let texto = event.target.value;
        if (!texto) return;

        let posts = JSON.parse(localStorage.getItem("posts")) || [];

        posts[posts.length - 1 - index].comentarios.push({
            nome: "anon",
            texto
        });

        localStorage.setItem("posts", JSON.stringify(posts));
        carregarFeed();
    }
}

// voltar
function voltar() {
    window.location.href = "index.html";
}

// iniciar
carregarFeed();
irTopo();
// rolar automaticamente para o topo após postar
function irTopo() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function excluirPost(index) {
    let posts = JSON.parse(localStorage.getItem("posts")) || [];

    // corrigir ordem (porque usamos reverse no feed)
    let realIndex = posts.length - 1 - index;

    // confirmação
    if (confirm("Tem certeza que deseja apagar esta publicação?")) {
        posts.splice(realIndex, 1);
        localStorage.setItem("posts", JSON.stringify(posts));
        carregarFeed();
    }
}
// alternar modo
function toggleDark() {
    document.body.classList.toggle("dark");

    // salvar preferência
    if (document.body.classList.contains("dark")) {
        localStorage.setItem("tema", "dark");
    } else {
        localStorage.setItem("tema", "light");
    }
}

// carregar preferência salva
(function () {
    let tema = localStorage.getItem("tema");
    if (tema === "dark") {
        document.body.classList.add("dark");
    }
})();