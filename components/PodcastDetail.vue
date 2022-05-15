<template>
  <div class="p-10 w-full h-full">
    <form class="m-5" @submit.prevent="submit">
      <div class="mb-5">
        <h1 class="text-2xl text-center">Add Podcast</h1>
      </div>
      <!-- Image Area -->
      <div
        ref="imgageHldr"
        class="
          self-center
          block
          cursor-pointer
          w-60
          h-60
          border-2 border-dotted
          rounded-md
          border-gray-500
          bg-center bg-cover
        "
        @click="chooseFile"
        :style="{ 'background-image': `url(${filePreview})` }"
      >
        <div
          v-if="filePreview === null"
          class="flex flex-col h-full w-full justify-center bg-slate-200"
        >
          <div class="text-gray-500 text-center">
            klicken um Bild hinzuzufügen
          </div>
        </div>
        <div v-else @click="removeImage" class="text-red-500 text-right mr-2">
          X
        </div>
      </div>
      <div>
        <input
          class="invisible"
          ref="fileInput"
          type="file"
          id="formFileLg"
          @change="selectImgFile"
        />
      </div>
      <!-- Fields-->
      <div class="flex flex-col">
        <div class="flex flex-col">
          <label class="pl-2 text-sm text-gray-500" for="title">Title</label>
          <input
            :class="getClass('title')"
            type="text"
            name="title"
            v-model="fields.title"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="subtitle"
            >Sub Title</label
          >
          <input
            class="field"
            type="text"
            name="subtitle"
            v-model="fields.subtitle"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="author">Author</label>
          <input
            :class="getClass('title')"
            type="text"
            name="author"
            v-model="fields.author"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="summary"
            >Summary</label
          >
          <textarea
            class="textarea h-28"
            type="text"
            name="summary"
            v-model="fields.summary"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="description"
            >Description</label
          >
          <textarea
            class="textarea h-28"
            type="text"
            name="description"
            v-model="fields.description"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="language"
            >Language</label
          >
          <select
            :class="getClass('language')"
            type="text"
            name="language"
            v-model="language_id"
          >
            <option
              v-for="langOption in languages"
              :key="langOption.id"
              :value="langOption.shorttext"
            >
              {{ langOption.displaytext }}
            </option>
          </select>
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="category"
            >Category</label
          >
          <select
            :class="getClass('category')"
            type="text"
            name="category"
            v-model="category_id"
          >
            <option
              v-for="categoryOption in categories"
              :key="categoryOption.id"
              :value="categoryOption.id"
            >
              {{ categoryOption.parentCategory }} -
              {{ categoryOption.displaytext }}
            </option>
          </select>
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="type">Type</label>
          <select
            :class="getClass('type')"
            type="text"
            name="type"
            v-model="type_id"
          >
            <option
              v-for="typeOption in types"
              :key="typeOption.id"
              :value="typeOption.id"
            >
              {{ typeOption.displaytext }}
            </option>
          </select>
        </div>
        <div class="flex flex-row mt-3">
          <div
            class="
              relative
              w-12
              h-6
              transition
              duration-200
              ease-linear
              rounded-2xl
            "
            :class="[fields.explicit ? 'bg-orange-300' : 'bg-gray-200']"
          >
            <label
              for="toggle"
              class="
                absolute
                left-0
                w-6
                h-6
                mb-2
                transition
                duration-100
                ease-linear
                transform
                bg-white
                border-2
                rounded-2xl
                cursor-pointer
              "
              :class="[
                fields.explicit
                  ? 'translate-x-full border-orange-300'
                  : 'translate-x-0 border-gray-300',
              ]"
            ></label>
            <input
              type="checkbox"
              id="toggle"
              name="toggle"
              class="w-full h-full appearance-none focus:outline-none"
              @click="fields.explicit = !fields.explicit"
            />
          </div>
          <span class="ml-3 text-gray-500 text-sm font-medium">{{
            fields.explicit
              ? "Contains explicit content"
              : "Is clean from explicit content"
          }}</span>
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="author">Link</label>
          <input
            :class="getClass('link')"
            type="text"
            name="link"
            v-model="fields.link"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="copyright"
            >Copyright</label
          >
          <input
            class="field"
            type="text"
            name="copyright"
            v-model="fields.copyright"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="owner_name"
            >Owner name</label
          >
          <input
            :class="getClass('owner_name')"
            type="text"
            name="owner_name"
            v-model="fields.owner_name"
          />
        </div>
        <div class="flex flex-col mt-3">
          <label class="pl-2 text-sm text-gray-500" for="owner_email"
            >Owner email</label
          >
          <input
            :class="getClass('title')"
            type="text"
            name="owner_email"
            v-model="fields.owner_email"
          />
        </div>
        <div v-if="errors.length > 0" class="mt-5 ml-5 test-xs text-red-600">
          <p>Pleas correct the following issues:</p>
          <ul class="ml-5">
            <li class="list-disc" v-for="err in errors">{{ err.text }}</li>
          </ul>
        </div>
        <div class="flex flex-row justify-end">
          <button
            class="
              mt-5
              px-5
              h-10
              border-2
              rounded-md
              bg-gray-300
              hover:bg-gray-400
            "
            @click="cancel"
          >
            Cancel
          </button>
          <button
            class="
              mt-5
              ml-5
              px-5
              h-10
              border-2
              rounded-md
              bg-orange-300
              hover:bg-orange-400
            "
            @click="submit"
          >
            Save Podcast
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Podcast from "~~/backend/entities/Podcast";

export default defineComponent({
  props: ["podcast"],
  name: "PodcastDetail",
  data: () => {
    return {
      file: null,
      filePreview: null,
      imgWidth: 0,
      imgHeight: 0,
      languages: [],
      categories: [],
      types: [],
      errors: [],
      language_id: 0,
      category_id: 0,
      type_id: 0,
      fields: {
        title: "",
        subtitle: "",
        author: "",
        summary: "",
        description: "",
        language: "",
        category: "",
        subcategory: "",
        explicit: false,
        type: "",
        link: "",
        copyright: "",
        owner_name: "",
        owner_email: "",
      },
    };
  },
  async mounted() {
    if (this.languages.length == 0) {
      var enums = await $fetch("/api/enums");
      this.languages = enums.filter((item) => item.enum_id === 0);
      this.categories = enums.filter((item) => item.enum_id === 1);
      this.types = enums.filter((item) => item.enum_id === 2);
    }
  },
  watch: {
    category_id(nVal, oVal) {
      var cat = this.categories.find((item) => item.id == nVal);
      this.fields.category = cat.parentCategory;
      this.fields.subcategory = cat.displaytext;
    },
    type_id(nVal, oVal) {
      var typ = this.types.find((item) => item.id == nVal);
      this.fields.type = typ.displaytext;
    },
    language_id(nVal, oVal) {
      var lang = this.languages.find((item) => item.id == nVal);
      this.fields.language = lang.displaytext;
    },
    podcast(newVal, _) {
      //this.fields = { ...newVal };
      console.log("oid");
      this.fields.title = this.currentPodcast.title;
    },
  },
  methods: {
    hasError(fieldname) {
      return this.errors.find((e) => e.field === fieldname);
    },
    getClass(fieldname) {
      var cssclass = "field";
      if (this.hasError(fieldname)) {
        cssclass = "field error";
      }
      return cssclass;
    },
    validation() {
      this.errors = [];
      if (!(this.imgWidth == 1400 && this.imgHeight == 1400))
        this.errors.push({
          field: "img",
          text: "Please select an image with the exact dimensions of 1400x1400 pixel",
        });
      if (this.fields.title.length < 1)
        this.errors.push({ field: "title", text: "Please enter a title" });
      if (this.fields.author.length < 1)
        this.errors.push({ field: "author", text: "Please enter an author" });
      if (this.fields.language.length < 1)
        this.errors.push({
          field: "language",
          text: "Please select the language",
        });
      if (this.fields.category.length < 1)
        this.errors.push({
          field: "category",
          text: "Please select a category for your content",
        });
      if (this.fields.type.length < 1)
        this.errors.push({
          field: "type",
          text: "Please select the publishing type",
        });
      var re =
        /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
      if (this.fields.link.length < 1 || re.test(this.fields.link) == false)
        this.errors.push({ field: "link", text: "Please enter the link" });
      if (this.fields.owner_name.length < 1)
        this.errors.push({
          field: "owner_name",
          text: "Please enter the owners name",
        });
      re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (
        this.fields.owner_email.length < 1 ||
        re.test(this.fields.owner_email) == false
      )
        this.errors.push({
          field: "owner_email",
          text: "Please enter a valid email address",
        });
      return this.errors.length == 0;
    },
    getFormData() {
      var fd = new FormData();
      if (this.file) fd.append("cover", this.file, this.file.name);
      Object.keys(this.fields).forEach((key) => {
        fd.append(key, this.fields[key]);
      });
      return fd;
    },
    async submit() {
      if (this.validation()) {
        var formData = this.getFormData();
        var postData = {
          method: "post",
          body: formData,
        };
        var postResult = await $fetch("/api/podcast", postData);
        if (postResult.status == 201) {
          this.clearAll(this);
          this.$emit("onsaved", this.fields.title);
        }
      }
    },
    cancel() {
      this.clearAll(this);
      this.$emit("oncancel");
    },
    removeImage(event) {
      this.filePreview = null;
      this.imgWidth = 0;
      this.imgHeight = 0;
      event.stopImmediatePropagation();
    },
    chooseFile() {
      this.$refs.fileInput.click();
    },
    selectImgFile(event) {
      this.file = event.target.files[0];
      if (this.file) {
        let img = new Image();
        let reader = new FileReader();
        reader.onload = (e) => {
          this.filePreview = e.target.result;
          img.onload = () => {
            this.imgWidth = img.naturalWidth;
            this.imgHeight = img.naturalHeight;
          };
          img.src = e.target.result as any;
        };
        reader.readAsDataURL(this.file);
        this.$emit("fileInput", this.file);
      }
    },
    clearAll(self) {
      this.file = null;
      this.filePreview = null;
      this.imgWidth = 0;
      this.imgHeight = 0;

      this.errors = [];
      this.fields.title = "";
      this.fields.subtitle = "";
      this.fields.author = "";
      this.fields.summary = "";
      this.fields.description = "";
      this.fields.language = "";
      this.fields.category = "";
      this.fields.subcategory = "";
      this.fields.explicit = false;
      this.fields.type = "";
      this.fields.link = "";
      this.fields.copyright = "";
      this.fields.owner_name = "";
      this.fields.owner_email = "";
      //this.category_id = 0;
    },
  },
});
</script>

<style lang="postcss" scoped>
.field {
  @apply border-2
              h-10
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              valid:border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300;
}
.error {
  @apply ring-orange-700 ring-1;
}
.textarea {
  @apply border-2
              px-3
              py-1
              mt-1
              rounded-md
              text-gray-600
              border-gray-200
              focus:outline-none focus:ring-1 focus:ring-orange-300;
}
</style>