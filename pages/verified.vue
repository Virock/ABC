<template>
  <div>
    <my-header :logged_in="logged_in" :page="page"/>
    <my-banner :title="title"/>
    <section class="about py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4" id="congratulations">{{$t('congratlations')}}</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-6 mb-lg-0 w3-agile-grid mb-5">
            <p>{{$t('your_account_has_been_verified')}}</p>
            <p>{{$t('you_will_be_logged_in_shortly')}}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import MyBanner from "~/components/Banner.vue";
import MyHeader from "~/components/Header.vue";
// import base64Img from 'base64-img';
function getCookie(cookiename, cookies) {
  // Get name followed by anything except a semicolon
  var cookiestring = RegExp("" + cookiename + "[^;]+").exec(cookies);
  // Return everything after the equal sign, or an empty string if the cookie name not found
  return decodeURIComponent(
    !!cookiestring ? cookiestring.toString().replace(/^[^=]+./, "") : ""
  );
}

let vue_context;

export default {
  components: {
    MyBanner,
    MyHeader
  },
  created: function() {
    vue_context = this;
  },
  async mounted() {},
  async asyncData(context) {},
  data() {
    return {
      title: "Account Verified",
      error: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      image: null,
      logged_in: false,
      page: "verify_account"
    };
  },
  head() {
    return {
      title: "Asset Building Clinic : You have been verified",
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "You have been successfully verified. You will be logged in shortly"
        }
      ],
      meta: [
        {
          "http-equiv": "refresh",
          content: `5; url= ${process.env.website}acts`
        }
      ]
    };
  },
  methods: {}
};
</script>