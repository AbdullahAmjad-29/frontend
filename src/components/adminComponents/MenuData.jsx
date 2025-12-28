// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Box, Stack, Chip, Grid, Paper, Typography, Modal } from "@mui/material";
// import { RiceBowl, LocalBar, Fastfood } from "@mui/icons-material";
// import { TextField, IconButton, Button } from '@mui/material';
// import { Add, Delete } from '@mui/icons-material';

// const MenuData = () => {
//   const [menuData, setMenuData] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [editModalOpen, setEditModalOpen] = useState(false);
//   const [selectedMenuForEdit, setSelectedMenuForEdit] = useState(null); // Add this state

//   // States for edit modal
//   const [menuName, setMenuName] = useState("");
//   const [items, setItems] = useState([]);
//   const [saving, setSaving] = useState(false); // Renamed from loading to avoid conflict

//   // Initialize form with menu data when modal opens
//   useEffect(() => {
//     if (selectedMenuForEdit && editModalOpen) {
//       setMenuName(selectedMenuForEdit.categoryName || "");
//       setItems(
//         selectedMenuForEdit.menuItems?.map((item) => ({
//           name: item.itemName,
//           price: item.itemPrice,
//           _id: item._id,
//         })) || []
//       );
//     }
//   }, [selectedMenuForEdit, editModalOpen]);

//   const handleItemChange = (index, field, value) => {
//     const updatedItems = [...items];
//     updatedItems[index][field] = field === "price" ? Number(value) : value;
//     setItems(updatedItems);
//   };

//   const handleAddItem = () => {
//     setItems([...items, { name: "", price: 0 }]);
//   };

//   const handleRemoveItem = (index) => {
//     const updatedItems = items.filter((_, i) => i !== index);
//     setItems(updatedItems);
//   };

//   const handleSave = async () => {
//     if (!selectedMenuForEdit?._id) return;

//     const updatedMenu = {
//       categoryName: menuName,
//       menuItems: items.map((item) => ({
//         itemName: item.name,
//         itemPrice: item.price,
//         ...(item._id && { _id: item._id }),
//       })),
//     };

//     try {
//       setSaving(true);
//       const response = await axios.put(
//         `http://localhost:7001/api/menu/updateMenu/${selectedMenuForEdit._id}`,
//         updatedMenu
//       );

//       if (response.data.success) {
//         // Refresh the menu data
//         await fetchMenus();
//         setEditModalOpen(false);
//         setSelectedMenuForEdit(null);
//       }
//     } catch (error) {
//       console.error("Error updating menu:", error);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEditClick = (menu) => {
//     // Find the original menu data from your API response
//     const originalMenuData = menuData.find(m => m.id === menu.id);
//     if (originalMenuData) {
//       setSelectedMenuForEdit({
//         _id: menu.id,
//         categoryName: menu.name,
//         menuItems: menu.items.map(item => ({
//           itemName: item.name,
//           itemPrice: item.price,
//           _id: item.id
//         }))
//       });
//       setEditModalOpen(true);
//     }
//   };

//   const handleCloseModal = () => {
//     setEditModalOpen(false);
//     setSelectedMenuForEdit(null);
//     setMenuName("");
//     setItems([]);
//   };

//   // Rest of your existing code remains the same...
//   const getIcon = (categoryName) => {
//     const iconMap = {
//       rice: <RiceBowl />,
//       Drinkss: <LocalBar />,
//       "fast food menu": <Fastfood />,
//     };
//     return iconMap[categoryName] || <Fastfood />;
//   };

//   const getColor = (categoryName) => {
//     const colorMap = {
//       rice: "#4CAF50",
//       Drinkss: "#2196F3",
//       "fast food menu": "#FF5722",
//     };
//     return colorMap[categoryName] || "#757575";
//   };

//   useEffect(() => {
//     fetchMenus();
//   }, []);

//   const fetchMenus = async () => {
//     try {
//       const response = await axios.get(
//         "http://localhost:7001/api/menu/getAllMenus"
//       );
//       if (response.data.success) {
//         const formattedData = response.data.data.map((menu) => ({
//           id: menu._id,
//           name: menu.categoryName,
//           icon: getIcon(menu.categoryName),
//           color: getColor(menu.categoryName),
//           items: menu.menuItems.map((item) => ({
//             name: item.itemName,
//             price: item.itemPrice,
//             id: item._id,
//           })),
//         }));
//         setMenuData(formattedData);
//         if (formattedData.length > 0) {
//           setSelectedCategory(formattedData[0].id);
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching menus:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectedMenu = menuData.find(
//     (menu) => menu.id === selectedCategory
//   ) || { items: [] };

//   if (loading) return <Typography>Loading...</Typography>;

//   return (
//     <>
//       {/* Category Tabs */}
//       <Box sx={{ mb: 3 }}>
//         <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
//           {menuData.map((menu) => (
//             <Chip
//               key={menu.id}
//               icon={menu.icon}
//               label={menu.name}
//               onClick={() => setSelectedCategory(menu.id)}
//               onDoubleClick={() => handleEditClick(menu)} // Add double click to edit
//               sx={{
//                 backgroundColor:
//                   selectedCategory === menu.id ? menu.color : "#e0e0e0",
//                 color: selectedCategory === menu.id ? "white" : "#666",
//                 fontWeight: "bold",
//                 padding: "8px 16px",
//                 mb: 1,
//                 "&:hover": {
//                   backgroundColor:
//                     selectedCategory === menu.id ? menu.color : "#d5d5d5",
//                   opacity: 0.9,
//                 },
//                 cursor: "pointer",
//               }}
//             />
//           ))}
//         </Stack>
//       </Box>

//       {/* Menu Items Grid */}
//       <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
//         <Grid container spacing={2}>
//           {selectedMenu.items.map((item) => (
//             <Grid item xs={12} sm={6} key={item.id}>
//               <Paper
//                 sx={{
//                   padding: 2.5,
//                   borderRadius: 2,
//                   borderLeft: `4px solid ${selectedMenu.color}`,
//                   backgroundColor: "#f9f9f9",
//                   height: "100%",
//                   transition: "transform 0.2s, box-shadow 0.2s",
//                   "&:hover": {
//                     transform: "translateY(-2px)",
//                     boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
//                   },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     display: "flex",
//                     justifyContent: "space-between",
//                     alignItems: "flex-start",
//                     mb: 1,
//                   }}
//                 >
//                   <Typography
//                     variant="subtitle1"
//                     sx={{ fontWeight: "bold", color: "#2C3E50" }}
//                   >
//                     {item.name}
//                   </Typography>
//                   <Typography
//                     variant="h6"
//                     sx={{ color: "#2E7D32", fontWeight: "bold" }}
//                   >
//                     ${item.price}
//                   </Typography>
//                 </Box>
//               </Paper>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>

//       {/* Edit Modal for Menu */}
//       <Modal open={editModalOpen} onClose={handleCloseModal}>
//         <Box
//           sx={{
//             width: 500,
//             margin: "auto",
//             backgroundColor: "white",
//             borderRadius: 3,
//             padding: 4,
//             marginTop: "10vh",
//             maxHeight: "80vh",
//             overflowY: "auto",
//             boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//           }}
//         >
//           <Typography
//             variant="h5"
//             sx={{ mb: 3, fontWeight: "bold", color: "#2C3E50" }}
//           >
//             Edit Menu Category
//           </Typography>

//           <Grid container spacing={2} sx={{ marginBottom: 3 }}>
//             <Grid item xs={12}>
//               <TextField
//                 label="Category Name"
//                 variant="outlined"
//                 fullWidth
//                 value={menuName}
//                 onChange={(e) => setMenuName(e.target.value)}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     borderRadius: 2,
//                   },
//                 }}
//               />
//             </Grid>
//           </Grid>

//           <Typography variant="h6" sx={{ mb: 2, color: "#2C3E50" }}>
//             Menu Items
//           </Typography>

//           {items.map((item, index) => (
//             <Paper
//               key={item._id || index}
//               sx={{
//                 padding: 2,
//                 mb: 2,
//                 borderRadius: 2,
//                 backgroundColor: "#f9f9f9",
//               }}
//             >
//               <Grid container spacing={2} alignItems="center">
//                 <Grid item xs={6}>
//                   <TextField
//                     label="Item Name"
//                     variant="outlined"
//                     fullWidth
//                     value={item.name}
//                     onChange={(e) =>
//                       handleItemChange(index, "name", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         borderRadius: 1,
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={4}>
//                   <TextField
//                     label="Price ($)"
//                     variant="outlined"
//                     fullWidth
//                     type="number"
//                     value={item.price}
//                     onChange={(e) =>
//                       handleItemChange(index, "price", e.target.value)
//                     }
//                     sx={{
//                       "& .MuiOutlinedInput-root": {
//                         borderRadius: 1,
//                       },
//                     }}
//                   />
//                 </Grid>
//                 <Grid item xs={2}>
//                   <IconButton
//                     color="error"
//                     onClick={() => handleRemoveItem(index)}
//                     sx={{
//                       backgroundColor: "rgba(244, 67, 54, 0.1)",
//                       "&:hover": {
//                         backgroundColor: "rgba(244, 67, 54, 0.2)",
//                       },
//                     }}
//                   >
//                     <Delete />
//                   </IconButton>
//                 </Grid>
//               </Grid>
//             </Paper>
//           ))}

//           <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
//             <Button
//               variant="outlined"
//               startIcon={<Add />}
//               onClick={handleAddItem}
//               sx={{
//                 borderRadius: 2,
//                 borderColor: "#45B7D1",
//                 color: "#45B7D1",
//                 "&:hover": {
//                   borderColor: "#3AA3C4",
//                 },
//               }}
//             >
//               Add Item
//             </Button>
//             <Box sx={{ flex: 1 }} />
//             <Button
//               variant="outlined"
//               onClick={handleCloseModal}
//               disabled={saving}
//               sx={{
//                 borderRadius: 2,
//                 borderColor: "#999",
//                 color: "#666",
//                 "&:hover": {
//                   borderColor: "#777",
//                 },
//               }}
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="contained"
//               onClick={handleSave}
//               disabled={saving}
//               sx={{
//                 borderRadius: 2,
//                 background: "linear-gradient(to right, #FF6B6B, #FF8E53)",
//                 fontWeight: "bold",
//                 "&:hover": {
//                   background: "linear-gradient(to right, #FF5252, #FF7B3A)",
//                 },
//               }}
//             >
//               {saving ? "Saving..." : "Save Changes"}
//             </Button>
//           </Box>
//         </Box>
//       </Modal>
//     </>
//   );
// };

// export default MenuData;



import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, Stack, Chip, Grid, Paper, Typography, Modal } from "@mui/material";
import { RiceBowl, LocalBar, Fastfood } from "@mui/icons-material";
import { TextField, IconButton, Button } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';

// Only open and onClose are from parent
const MenuData = ({ open, onClose }) => {
  const [menuData, setMenuData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(true);

  // States for edit modal
  const [menuName, setMenuName] = useState("");
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState(null); // Track which menu is being edited

  // Initialize form when modal opens with currently selected menu
  useEffect(() => {
    if (open && selectedCategory) {
      const menuToEdit = menuData.find(menu => menu.id === selectedCategory);
      if (menuToEdit) {
        setEditingMenuId(menuToEdit.id);
        setMenuName(menuToEdit.name || "");
        setItems(
          menuToEdit.items.map((item) => ({
            name: item.name,
            price: item.price,
            id: item.id,
          })) || []
        );
      }
    } else {
      // Reset when modal closes
      setMenuName("");
      setItems([]);
      setEditingMenuId(null);
    }
  }, [open, selectedCategory, menuData]); // Watch open state and selectedCategory

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = field === "price" ? Number(value) : value;
    setItems(updatedItems);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSave = async () => {
    if (!editingMenuId) return;

    const updatedMenu = {
      categoryName: menuName,
      menuItems: items.map((item) => ({
        itemName: item.name,
        itemPrice: item.price,
        ...(item.id && { _id: item.id }), // Use item.id for existing items
      })),
    };

    try {
      setSaving(true);
      const response = await axios.put(
        `http://localhost:7001/api/menu/updateMenu/${editingMenuId}`,
        updatedMenu
      );

      if (response.data.success) {
        // Refresh the menu data
        await fetchMenus();
        onClose();
      }
    } catch (error) {
      console.error("Error updating menu:", error);
    } finally {
      setSaving(false);
    }
  };

  // Rest of your existing code...
  const getIcon = (categoryName) => {
    const iconMap = {
      rice: <RiceBowl />,
      Drinkss: <LocalBar />,
      "fast food menu": <Fastfood />,
    };
    return iconMap[categoryName] || <Fastfood />;
  };

  const getColor = (categoryName) => {
    const colorMap = {
      rice: "#4CAF50",
      Drinkss: "#2196F3",
      "fast food menu": "#FF5722",
    };
    return colorMap[categoryName] || "#757575";
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await axios.get(
        "http://localhost:7001/api/menu/getAllMenus"
      );
      if (response.data.success) {
        const formattedData = response.data.data.map((menu) => ({
          id: menu._id,
          name: menu.categoryName,
          icon: getIcon(menu.categoryName),
          color: getColor(menu.categoryName),
          items: menu.menuItems.map((item) => ({
            name: item.itemName,
            price: item.itemPrice,
            id: item._id,
          })),
        }));
        setMenuData(formattedData);
        if (formattedData.length > 0) {
          setSelectedCategory(formattedData[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching menus:", error);
    } finally {
      setLoading(false);
    }
  };

  const selectedMenu = menuData.find(
    (menu) => menu.id === selectedCategory
  ) || { items: [] };

  if (loading) return <Typography>Loading...</Typography>;

  return (
    <>
      {/* Category Tabs */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
          {menuData.map((menu) => (
            <Chip
              key={menu.id}
              icon={menu.icon}
              label={menu.name}
              onClick={() => setSelectedCategory(menu.id)}
              sx={{
                backgroundColor:
                  selectedCategory === menu.id ? menu.color : "#e0e0e0",
                color: selectedCategory === menu.id ? "white" : "#666",
                fontWeight: "bold",
                padding: "8px 16px",
                mb: 1,
                "&:hover": {
                  backgroundColor:
                    selectedCategory === menu.id ? menu.color : "#d5d5d5",
                  opacity: 0.9,
                },
                cursor: "pointer",
              }}
            />
          ))}
        </Stack>
      </Box>

      {/* Menu Items Grid */}
      <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
        <Grid container spacing={2}>
          {selectedMenu.items.map((item) => (
            <Grid item xs={12} sm={6} key={item.id}>
              <Paper
                sx={{
                  padding: 2.5,
                  borderRadius: 2,
                  borderLeft: `4px solid ${selectedMenu.color}`,
                  backgroundColor: "#f9f9f9",
                  height: "100%",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "#2C3E50" }}
                  >
                    {item.name}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#2E7D32", fontWeight: "bold" }}
                  >
                    ${item.price}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Edit Modal - Controlled by parent's open/close */}
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            width: 500,
            margin: "auto",
            backgroundColor: "white",
            borderRadius: 3,
            padding: 4,
            marginTop: "10vh",
            maxHeight: "80vh",
            overflowY: "auto",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }}
        >
          <Typography
            variant="h5"
            sx={{ mb: 3, fontWeight: "bold", color: "#2C3E50" }}
          >
            Edit Menu Category
          </Typography>

          <Grid container spacing={2} sx={{ marginBottom: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Category Name"
                variant="outlined"
                fullWidth
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
          </Grid>

          <Typography variant="h6" sx={{ mb: 2, color: "#2C3E50" }}>
            Menu Items
          </Typography>

          {items.map((item, index) => (
            <Paper
              key={item.id || index}
              sx={{
                padding: 2,
                mb: 2,
                borderRadius: 2,
                backgroundColor: "#f9f9f9",
              }}
            >
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <TextField
                    label="Item Name"
                    variant="outlined"
                    fullWidth
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Price ($)"
                    variant="outlined"
                    fullWidth
                    type="number"
                    value={item.price}
                    onChange={(e) =>
                      handleItemChange(index, "price", e.target.value)
                    }
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={2}>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(index)}
                    sx={{
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.2)",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={handleAddItem}
              sx={{
                borderRadius: 2,
                borderColor: "#45B7D1",
                color: "#45B7D1",
                "&:hover": {
                  borderColor: "#3AA3C4",
                },
              }}
            >
              Add Item
            </Button>
            <Box sx={{ flex: 1 }} />
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={saving}
              sx={{
                borderRadius: 2,
                borderColor: "#999",
                color: "#666",
                "&:hover": {
                  borderColor: "#777",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{
                borderRadius: 2,
                background: "linear-gradient(to right, #FF6B6B, #FF8E53)",
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(to right, #FF5252, #FF7B3A)",
                },
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MenuData;