Stripe.setPublishableKey('pk_test_8BGugKsTthRM4pXH0berZ88700T60quqkA');

const $form = $('#checkout-form');

$form.submit(function(event) {
  // Clear any errors from before when trying to submit again
  $('#charge-error').addClass('hidden');
  // Do not allow multiple submissions while the form is in use
  $form.find('button').prop('disabled', true);

  Stripe.card.createToken({
    number: $('#card-number').val(),
    cvc: $('#card-cvc').val(),
    exp_month: $('#card-expiry-month').val(),
    exp_year: $('#card-expiry-year').val(),
    name: $('#card-name').val();
  }, stripeResponseHandler);
  // make sure form submission is stopped so donnot submit it to the server yet
  return false;
});

function stripeResponseHandler(status, response) {
  if (response.error) { // Problem!

    // Show the errors on the form
    $('#charge-error').text(response.error.message);
    $('#charge-error').removeClass('hidden');
    $form.find('button').prop('disabled', false); // Re-enable submission

  } else { // Token was created!

    // Get the token ID:
    var token = response.id;

    // Insert the token into the form so it gets submitted to the server:
    $form.append($('<input type="hidden" name="stripeToken"/>').val(token));

    // Submit the form:
    $form.get(0).submit();
  }
}
