import fs from 'fs';

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

    getProductsById = (id) => {
        const product = JSON.parse(fs.promises.readFile(this.#filename.find(producto => producto.id === id)));
        if (!product) return 'Not Found'
        return product
    }

    #generateId = () => (this.#filename.length === 0) ? 1 : this.#filename[this.#filename.length-1].id + 1

    #validateProduct = (title, description, price, thumbnail, code, stock) => {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            this.#error = `[${code}]: campos incompletos`
        } else {
            const found = this.#filename.find(producto => producto.code === code)
            if (found) this.#error = `[${code}]: el code ya existe`
            else this.#error = undefined
        }
    }

    addProduct = (title, description, price, thumbnail,code,stock) => {
        this.#validateProduct(title, description, price, thumbnail,code,stock)
        if (this.#error === undefined) 
            this.#filename.push({id: this.#generateId(),title, description,  price, thumbnail,code,stock})
        else 
            console.log(this.#error)
    }

}

const product = new ProductManager()
