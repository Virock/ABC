<template>
  <div>
    <my-header :logged_in="logged_in" :page="page"/>
    <my-banner :title="title"/>
    <section class="about py-5">
      <div class="container py-md-3">
        <h3 class="heading mb-md-5 mb-4" id="congratulations">{{$t('congratulations')}}</h3>
        <div class="row about-grids agile-info">
          <div class="col-lg-6 mb-lg-0 w3-agile-grid mb-5">
            <p>{{$t('your_account_has_been_created')}}</p>
            <p>{{$t('click_on_the_link_to_verify')}}</p>
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
  async asyncData(context) {
    //Redirect to main page
    if (!context.params.id) context.redirect("/");
    //Else
    else {
      //Make call to verification endpoint
      await axios
        .put(`${process.env.website}api/verify/${context.params.id}`)
        .then(function(res) {
          if (process.server) {
            context.app.$cookies.set("token", res.data.token, {
              path: "/",
              maxAge: 3600000
            });
            context.app.$cookies.set("refresh_token", res.data.refresh_token, {
              path: "/",
              maxAge: 31536000000
            });
            context.redirect("/acts");
          }
        })
        .catch(function(err) {
          if (err.response.status == 401) {
            context.redirect("/logout");
          }
        });
    }
  },
  head() {
    return {
      title: "Asset Building Clinic : Verify User",
      meta: [
        {
          hid: "description",
          name: "description",
          content: "Verify the identity of a user"
        }
      ]
    };
  },
  data() {
    return {
      title: "Verify your account",
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
  methods: {}
};
</script>