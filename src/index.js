const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
const ASAAS_BASE_URL = "https://sandbox.asaas.com/api/v3";

app.post("/create-payment", async (req, res) => {
  try {
    const paymentData = req.body;

    console.log("Data:", paymentData);
    const response = await axios.post(
      `${ASAAS_BASE_URL}/payments`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "nome_da_sua_aplicacao",
          access_token: ASAAS_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Erro ao criar pagamentosess:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Erro ao criar pagamento" });
  }
});

app.post("/create-customer", async (req, res) => {
  console.log(req.body);
  try {
    const customerData = req.body;
    const response = await axios.post(
      `${ASAAS_BASE_URL}/customers`,
      customerData,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "nome_da_sua_aplicacao",
          access_token: ASAAS_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Erro ao criar cliente:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Erro ao criar cliente" });
  }
});

// Rota para listar clientes
app.get("/list-customers", async (req, res) => {
  try {
    const {
      name,
      email,
      cpfCnpj,
      groupName,
      externalReference,
      offset,
      limit,
    } = req.query;
    const response = await axios.get(`${ASAAS_BASE_URL}/customers`, {
      headers: {
        "Content-Type": "application/json",
        access_token: ASAAS_API_KEY,
      },
      params: {
        name,
        email,
        cpfCnpj,
        groupName,
        externalReference,
        offset,
        limit,
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error(
      "Erro ao listar clientes:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Erro ao listar clientes" });
  }
});

// Rota para pagar cobrança com cartão de crédito
app.post("/pay-charge/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const paymentData = req.body;
    const response = await axios.post(
      `${ASAAS_BASE_URL}/payments/${id}/payWithCreditCard`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "nome_da_sua_aplicacao",
          access_token: ASAAS_API_KEY,
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error(
      "Erro ao pagar cobrança:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Erro ao pagar cobrança" });
  }
});

app.post("/create-and-pay", async (req, res) => {
  try {
    const paymentData = req.body;
    console.log("Dados do pagamento recebidos:", paymentData);

    // Verificação extra do billingType e CPF/CNPJ
    // if (paymentData.billingType !== "CREDIT_CARD") {
    //   return res.status(400).json({ error: "Forma de pagamento inválida." });
    // }

    // if (!paymentData.creditCardHolderInfo.cpfCnpj) {
    //   return res.status(400).json({ error: "CPF/CNPJ é obrigatório." });
    // }

    const response = await axios.post(
      `${ASAAS_BASE_URL}/payments`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
          access_token: ASAAS_API_KEY,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error(
      "Erro ao criar pagamento:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      error: "Erro ao criar pagamento",
      details: error.response ? error.response.data : error.message,
    });
  }
});
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
