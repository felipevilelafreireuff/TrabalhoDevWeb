import Button from "./Button.jsx";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <div className="product-thumb">
        <img
          src={product.imagemUrl}
          alt={product.nome}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "/placeholder-product.svg";
          }}
        />
      </div>
      <div className="product-body">
        <p className="product-category">{product.categoria}</p>
        <h3 className="product-name">{product.nome}</h3>
        {product.descricao ? (
          <p className="product-description">{product.descricao}</p>
        ) : null}
        <div className="product-stars">
          ****<span>*</span> <span>(10)</span>
        </div>
        <div className="product-price-wrap">
          <div className="product-price">{formatCurrency(product.preco)}</div>
        </div>
        <Button fullWidth type="button">
          Adicionar
        </Button>
      </div>
    </article>
  );
}

function formatCurrency(value) {
  const price = Number(value);

  if (Number.isNaN(price)) {
    return "Preco indisponivel";
  }

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(price);
}
