import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Typography,
  TextField,
  Pagination,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
} from "@mui/material";
import ProductDetails from "./ProductDetails";
import SearchIcon from "@mui/icons-material/Search";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://dummyjson.com/products?limit=${itemsPerPage}&skip=${
            (page - 1) * itemsPerPage
          }`
        );
        setProducts(response.data.products);
        setTotalProducts(response.data.total);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [itemsPerPage, page]);

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (value) => {
    setPage(value);
  };

  const handleCardClick = (product) => {
    setSelectedProduct(product);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };


  if (loading) {
    return (
      <Box
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container>
      {selectedProduct ? (
        <ProductDetails
          open={!!selectedProduct}
          setSelectedProduct={setSelectedProduct}
          product={selectedProduct || {}}
        />
      ) : (
        <Box>
          <Grid
            container
            spacing={2}
            alignItems="center"
            style={{ marginBottom: 15, marginTop: 1 }}
          >
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                Product Catalog Viewer
              </Typography>
            </Grid>

            <Grid item>

            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h5" sx={{fontWeight:'bold'}}>
                Product Viewer
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                variant="outlined"
                placeholder="Search Product"
                value={searchTerm}
                onChange={handleSearchChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {filteredProducts.length === 0 ? (
            <Typography
              variant="body1"
              style={{
                textAlign: "center",
                marginTop: 20,
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              No products found.
            </Typography>
          ) : (
            <>
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        height: "100%",
                        cursor: "pointer",
                      }}
                      onClick={() => handleCardClick(product)}
                    >
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.thumbnail}
                        alt={product.title}
                      />
                      <CardContent sx={{ flexGrow: 1 }}>
                        <Typography gutterBottom variant="h6" component="div">
                          {product.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.description}
                        </Typography>
                        <Typography variant="body1" color="text.primary">
                          ${product.price}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>

              <Box mt={3} display="flex" justifyContent="center">
                <Pagination
                  count={Math.ceil(totalProducts / itemsPerPage)}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </Container>
  );
};

export default ProductList;
