using System;
using System.Diagnostics;
using System.Windows.Forms;

namespace ExcelSearchApp
{
    public class MainForm : Form
    {
        private TextBox txtBusca;
        private Button btnAbrirExcel;
        private Button btnLimparBusca;
        private Button btnSair;

        public MainForm()
        {
            // Configurações da janela
            this.Text = "App Portátil Excel";
            this.Width = 400;
            this.Height = 200;
            this.StartPosition = FormStartPosition.CenterScreen;

            // Caixa de texto
            txtBusca = new TextBox();
            txtBusca.Left = 20;
            txtBusca.Top = 20;
            txtBusca.Width = 250;
            this.Controls.Add(txtBusca);

            // Botão Abrir Excel
            btnAbrirExcel = new Button();
            btnAbrirExcel.Name = "btnAbrirExcel";
            btnAbrirExcel.Text = "Abrir Excel";
            btnAbrirExcel.Left = 20;
            btnAbrirExcel.Top = 60;
            btnAbrirExcel.Click += BtnAbrirExcel_Click;
            this.Controls.Add(btnAbrirExcel);

            // Botão Limpar Busca
            btnLimparBusca = new Button();
            btnLimparBusca.Name = "btnLimparBusca";
            btnLimparBusca.Text = "Limpar Busca";
            btnLimparBusca.Left = 140;
            btnLimparBusca.Top = 60;
            btnLimparBusca.Click += BtnLimparBusca_Click;
            this.Controls.Add(btnLimparBusca);

            // Botão Sair
            btnSair = new Button();
            btnSair.Name = "btnSair";
            btnSair.Text = "Sair";
            btnSair.Left = 260;
            btnSair.Top = 60;
            btnSair.Click += BtnSair_Click;
            this.Controls.Add(btnSair);
        }

        // Evento do botão Abrir Excel
        private void BtnAbrirExcel_Click(object sender, EventArgs e)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Filter = "Arquivos Excel|*.xlsx;*.xls";
                if (ofd.ShowDialog() == DialogResult.OK)
                {
                    Process.Start(ofd.FileName);
                }
            }
        }

        // Evento do botão Limpar Busca
        private void BtnLimparBusca_Click(object sender, EventArgs e)
        {
            txtBusca.Text = string.Empty;
        }

        // Evento do botão Sair
        private void BtnSair_Click(object sender, EventArgs e)
        {
            Application.Exit();
        }
    }
}
