<template>
  <div>
    <div class="page-container">
      <div class="left-content">
        <div class="mother-grid-inner">
          <my-header/>
          <!--inner block start here-->
          <div class="inner-block">
            <div class="login-main">
              <div class="login-head">
                <h1>{{$t('edit_reward')}}</h1>
              </div>
              <div class="login-block">
                <form @submit.prevent="editAct">
                  <input type="hidden" name="id" value="this_user._id">
                  <label for="name">{{$t('name')}}</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    :placeholder="$t('name')"
                    v-model="data.act.name"
                  >
                  <label for="description">{{$t('description')}}</label>
                  <textarea id="summernote" name="editordata"></textarea>
                  
                  <label for="reward_points">{{$t('value')}}</label>
                  <input
                    type="text"
                    name="reward_points"
                    :placeholder="$t('value')"
                    id="reward_points"
                    v-model="data.act.value"
                  >
                  <label for="amount">{{$t('amount')}}</label>
                  <input
                    type="text"
                    name="amount"
                    :placeholder="$t('amount')"
                    id="amount"
                    v-model="data.act.amount"
                  >
                  <br>
                  <div>
                    <a
                      tabindex="0"
                      style="cursor: pointer; margin-right: 1px"
                      class="badge badge-secondary"
                      @click="change_state()"
                    >{{data.act.enabled ? $t('enabled') : $t('disabled')}}</a>
                    <a
                      tabindex="0"
                      style="cursor: pointer; margin-right: 1px"
                      class="badge badge-secondary"
                      @click="change_act_state()"
                    >{{data.act.state}}</a>
                    <!-- <span style="margin-right: 1px" class="badge badge-secondary">{{data.act.state}}</span> -->
                    <span
                      v-if="data.act.deleted"
                      style="margin-right: 1px"
                      class="badge badge-secondary"
                    >{{$t('deleted')}}</span>
                  </div>
                  <div class="forgot-top-grids">
                    <div class="clearfix"></div>
                  </div>
                  <input type="submit" name="edit" :value="$t('edit')">
                </form>
                <!-- <h5><a href="/">Go Back to Home</a></h5> -->
              </div>
            </div>
          </div>
          <!--inner block end here-->
          <!--copy rights start here-->
          <my-footer/>
          <!--COPY rights end here-->
        </div>
      </div>
      <my-sidebar/>
      <div class="clearfix"></div>
    </div>
  </div>
</template>
<script>
import axios from "~/plugins/axios";
import moment from "moment";
import MySidebar from "~/components/Admin_Sidebar.vue";
import MyHeader from "~/components/Admin_Header.vue";
import MyFooter from "~/components/Admin_Footer.vue";
let vue_context, izitoast;

export default {
  layout: "admin",
  components: {
    MySidebar,
    MyHeader,
    MyFooter
  },
  created: function() {
    vue_context = this;
  },
  async mounted() {
    izitoast = require("izitoast");

    $(".form_datetime").datetimepicker({
      weekStart: 1,
      todayBtn: 1,
      autoclose: 1,
      todayHighlight: 1,
      startView: 2,
      forceParse: 0,
      showMeridian: 1
    });

    const doc = document.createElement("span");
    doc.innerHTML = vue_context.data.act.description;

    $(document).ready(function() {
      $("#summernote").summernote({
        placeholder: "Description",
        height: 300,
        toolbar: [
          // [groupName, [list of button]]
          ["para", ["style"]],
          ["style", ["bold", "underline", "clear"]],
          ["style", ["fontname", "fontsize"]],
          ["color", ["color"]],
          ["para", ["ul", "ol", "paragraph"]],
          ["insert", ["table"]],
          ["insert", ["link", "picture"]],
          ["misc", ["fullscreen", "codeview", "help"]]
        ]
      });
      $("#summernote").summernote("insertNode", doc);
    });

    $(".form_datetime")
      .datetimepicker()
      .on("changeDate", function(e) {
        //Update fields
        vue_context.data.act.start_time = document.getElementById(
          "start_time"
        ).value;
        vue_context.data.act.end_time = document.getElementById(
          "end_time"
        ).value;
      });

    var toggle = true;

    $(".sidebar-icon").click(function() {
      if (toggle) {
        $(".page-container")
          .addClass("sidebar-collapsed")
          .removeClass("sidebar-collapsed-back");
        $("#menu span").css({ position: "absolute" });
      } else {
        $(".page-container")
          .removeClass("sidebar-collapsed")
          .addClass("sidebar-collapsed-back");
        setTimeout(function() {
          $("#menu span").css({ position: "relative" });
        }, 400);
      }
      toggle = !toggle;
    });
  },
  head () {
    return {
      title: "Asset Building Clinic : Edit reward",
      meta: [
        { hid: 'description', name: 'description', content: 'Make changes to a reward' }
      ]
    }
  },
  data() {
    return {
      new_tags: ""
    };
  },
  methods: {
    async change_act_state() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      const act_state = this.data.act.state;

      //Get new state
      let new_state;
      if (act_state == "AVAILABLE") new_state = "NOT_AVAILABLE";
      else new_state = "AVAILABLE";
      //Change state of act
      this.data.act.state = new_state;
      //Make request to change state of act

      await axios
        .put(`/api/acts/${vue_context.data.act._id}/state`, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .catch(function(err) {
          //If error, revert state of act
          this.data.act.state = act_state;
          //Tell the user that the act could not be altered
          izitoast.error({
            title: "Error",
            message: "Sorry, the state could not be altered",
            position: "topRight"
          });
        });
    },
    async change_state() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      const state = this.data.act.enabled.state;

      //Change state
      this.data.act.enabled.state = !this.data.act.enabled.state;
      //Make request to change state of act

      await axios
        .put(
          `/api/acts/${vue_context.data.act._id}/enable/${
            vue_context.data.act.enabled.state
          }`,
          {
            headers: {
              Cookie: `token=${token}; refresh_token=${refresh_token};`
            }
          }
        )
        .catch(function(err) {
          //If error, revert state of act
          this.data.act.enabled.state = !this.data.act.enabled.state;
          //Tell the user that the act could not be altered
          izitoast.error({
            title: "Error",
            message: "Sorry, the state could not be altered",
            position: "topRight"
          });
        });
    },
    async editAct() {
      const token = this.$cookies.get("token");
      const refresh_token = this.$cookies.get("refresh_token");

      //Edit this act
      const params = new URLSearchParams();

      params.append("name", this.data.act.name);
      this.data.act.description = $("#summernote").summernote("code");
      params.append("description", this.data.act.description);
      params.append("value", this.data.act.value);
      params.append("amount", this.data.act.amount);

      await axios
        .put(`/api/rewards/${vue_context.data.act._id}`, params, {
          headers: {
            Cookie: `token=${token}; refresh_token=${refresh_token};`
          }
        })
        .then(function(res) {
          vue_context.new_tags = "";
          izitoast.success({
            title: "Success",
            message: `Changes were saved successfully`,
            position: "topRight"
          });
        })
        .catch(function(err) {
          izitoast.error({
            title: "Error",
            message: err.response.data.message,
            position: "topRight"
          });
        });
    }
  },
  async asyncData(context) {
    const token = context.app.$cookies.get("token");
    const refresh_token = context.app.$cookies.get("refresh_token");
    let data;
    await axios
      .get(`/api/rewards/${context.params.id}`, {
        headers: { Cookie: `token=${token}; refresh_token=${refresh_token};` }
      })
      .then(function(res) {
        data = res.data;
      })
      .catch(function(err) {
        if (err.response.status == 401) {
          context.redirect("/logout");
        }
      });
    return { data };
  }
};
</script>
