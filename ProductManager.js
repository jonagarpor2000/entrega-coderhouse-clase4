import fs from 'fs';
//Hola

class ProductManager {
    #filename
    #format
    #error
    
    constructor(filename) {
        this.#filename = filename
        this.#format = 'utf-8'
        this.#error=undefined
    };

    getProducts = async()=> {
        return JSON.parse(await fs.promises.readFile(this.#filename,this.#format))
    }
    

    getProductById = async(id) => {
        let contenido = await this.getProducts()
        const product = contenido.find(producto => producto.id === id);
        console.log(product)
        if (product) return 'Not Found'
        return product
    }
    

    #generateId = async () => {
     const products = await this.getProducts()
     return (products.length === 0) ? 1 : products[products.length-1].id + 1
    } 
    

    
    
    #validateProduct = async (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            this.#error = `[${code}]: campos incompletos`
        } else {
            let contenido = await this.getProducts()
            const found = contenido.find(producto => producto.code === code)
            if (found) this.#error = `[${code}]: el code ya existe`
            else this.#error = undefined
        }
    }

    addProduct = async (title, description, price, thumbnail,code,stock) => {
       
        let prodarr = []
        await this.#validateProduct(title, description, price, thumbnail,code,stock)
        if (this.#error === undefined){
            let id_prodarr = await this.#generateId()
            prodarr.push({id: id_prodarr,title, description,  price, thumbnail,code,stock})
            await fs.promises.appendFile(this.#filename, JSON.stringify(prodarr, null,'\t'))
        }else{ 
            console.log(this.#error)
            await fs.promises.writeFile(this.#filename, JSON.stringify(prodarr, null,'\t'))
        }

    }

    deleteProduct = async (id)=>{
        let contenido = await this.getProducts()
        let cont_nodelete = contenido.filter(producto => producto.id != id)
        await fs.promises.writeFile(this.#filename, JSON.stringify(cont_nodelete, null,'\t'))
    };

    updateProduct = async (id,title, description, price, thumbnail,code,stock)=>{
        let contenido = await this.getProducts()
        let map_cont = contenido.map(producto => producto.id)
        let indx = map_cont.indexOf(id)
        if(indx===-1){
            console.log('No existe tal producto');
        }else{
            let prod = {
                'id': id,
                'title': title,
                'description': description,
                'price': price,
                'thumbnail': thumbnail,
                'code': code,
                'stock': stock
            }
            contenido.splice(indx,1,prod)
            await fs.promises.writeFile(this.#filename, JSON.stringify(contenido, null,'\t'))
        }
        


    };

    

}

const productmg = new ProductManager('./products.json')
productmg.getProducts().then(productos => console.log(productos))
productmg.addProduct('producto prueba', 'Este es un producto prueba',200,'Sin imagen','abc12',25)
productmg.getProducts().then(productos => console.log(productos))
productmg.getProductById(1)
productmg.updateProduct(2,'Hola','Hola','Hola','Hola','Hola',2)
productmg.deleteProduct(1)


