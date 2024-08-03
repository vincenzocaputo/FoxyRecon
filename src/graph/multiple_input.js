class MultipleInput {
    constructor(inputElement, options) {
        this.options = options;
        this.inputElement = inputElement;
        const inputField = this.inputElement.querySelector("input");

        
        this.value = Array();
        if (this.options == null || !this.options || this.options.length === 0) {
            inputField.addEventListener("keyup", (evt) => {
                //evt.preventDefault();
                if (evt.keyCode === 13) {
                    const value = inputField.value;
                    if (!this.value.includes(value)) {
                        this.addTag(value);
                    }
                    inputField.value="";
                    evt.stopPropagation();
                    
                }
            });
        } else {
            inputField.addEventListener("input", this.showInputOptions);
            inputField.addEventListener("click", this.showInputOptions);
            inputField.addEventListener("mouseenter", evt => {
                if (document.activeElement === inputField) {
                    this.showInputOptions(evt);
                }
            });
            this.inputElement.closest(".multiple-input").addEventListener("mouseleave", evt => {
                this.inputElement.querySelector(".multiple-options").style.display = "none";
            });
        }


    }
    
    showInputOptions = evt => {
        const input = evt.target.value;
        const autocompleteOptions = this.inputElement.querySelector(".multiple-options");
        const inputField = this.inputElement.querySelector("input");
        
        
        autocompleteOptions.textContent = "";
        autocompleteOptions.style.display = "none";
        if (this.options) {
            this.options.forEach(option => {
                if ((option.toLowerCase().startsWith(input.toLowerCase()) || input === "") && !this.value.includes(option)) {
                    autocompleteOptions.style.display = "block";
                    const listItem = document.createElement("div");
                    listItem.textContent = option;
                    autocompleteOptions.appendChild(listItem);
                    
                    listItem.addEventListener("click", (evt) => {
                        this.addTag(option);
                        inputField.value = "";
                        autocompleteOptions.textContent = "";
                        autocompleteOptions.style.display = "none";
                    });
                    listItem.addEventListener("mouseenter", (evt) => {
                        evt.target.style.backgroundColor = "#CCCCCC";
                    });
                    listItem.addEventListener("mouseleave", (evt) => {
                        evt.target.style.backgroundColor = "#FFFFFF";
                    });
                }
            });
        }
    }

    addTag = text => {
        const inputWrapper = this.inputElement.querySelector(".tag-input-wrapper");
        const inputField = this.inputElement.querySelector("input");
        const tagContainer = document.createElement("div");
        tagContainer.classList.add("tag-container");

        const tag = document.createElement("div");
        const delTag = document.createElement("div");
        delTag.classList.add("del-tag");

        tag.textContent = text;
        
        tagContainer.appendChild(tag);
        tagContainer.appendChild(delTag);

        inputWrapper.insertBefore(tagContainer, inputField);
        this.value.push(text);

        delTag.addEventListener("click", () => {
            this.value.splice(this.value.indexOf(text), 1);
            tagContainer.remove();
        });
    }


}
