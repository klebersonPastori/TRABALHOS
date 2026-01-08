
import pandas as pd

caminho = input("Digite o caminho do arquivo Excel: ").strip()

try:
    df = pd.read_excel(caminho, engine="openpyxl")

    print("\n✅ Planilha carregada com sucesso.")
    print("Colunas disponíveis:", df.columns.tolist())
    print("Digite um nome para pesquisar ou 'sair' para encerrar.\n")

    if "Nome" not in df.columns:
        print("❌ A coluna 'Nome' não foi encontrada.")
        input("Pressione ENTER para sair...")
        exit()

    while True:
        nome = input("Nome: ").strip()

        if nome.lower() == "sair":
            print("Encerrando programa.")
            break

        resultado = df[
            df["Nome"].astype(str).str.lower() == nome.lower()
        ]

        if resultado.empty:
            print("❌ Pessoa não encontrada.\n")
        else:
            print()
            for coluna in resultado.columns:
                print(f"{coluna}: {resultado.iloc[0][coluna]}")
            print()

except Exception as e:
    print("❌ Erro:", e)

input("\n✅ Programa finalizado. Pressione ENTER para fechar...")
