---
title: '자바 기반의 백엔드와의 세션 공유를 위한 레일즈 세션 처리 분석'
author: odyss009
date: 2017-06-01 11:20
tags: [rails,session,cookie]
---

[레일즈] 기반의 프론트엔드(브라우저에서 서버 사이드 렌더링 계층까지)와 자바 기반의 백엔드(내부 API와 그 이후 계층)이 세션을 공유하기 위해
먼저 [레일즈]의 세션 처리 과정을 분석하고, [레일즈] 세션 쿠키를 다루기 위한 자바 소스 코드를 공유합니다.
<!--more-->

여기저기 자랑하고 다녔으니 아시는 분은 아시다시피 [레진은 구글앱엔진을 사용](https://www.slideshare.net/curioe_/lezhincomics-google-appengine-30453946)하고 있습니다.
지금이야 Java, Python, Node.js, Go 언어와 [Flexible Environment] 같은 다양한 선택지가 있지만,
레진이 입주할 당시만 해도 Java 7(subset), Python(subset)을 지원하는 [Standard Environment]라는 선택지 밖에 없었죠.

최근 ~~Saemaeul Undong~~ 기술 부채 탕감의 일환으로 
자바7, 스프링3.x, JSP(!) 기반의 백엔드에 포함되어 있던 프론트엔드를
레일즈 기반의 프론트엔드 서버(서버 사이드 렌더링을 담당하는 서버는 프론트일까요? 백엔드일까요?)로 분리하고 있습니다.

서로 다른 세계의 존재들 - **자바와 레일즈의 세션을 공유**해야하는 상황이 문제의 발단입니다.

자바와 [레일즈]의 세션을 공유하는 여러가지 방법이 있겠지만, 가장 단순하고 효과적인 방법은 쿠키(cookie)라고 판단하고,
**세션 encrypt/decrypt와 marshal/unmarshal을 동일한 방식으로 맞추기**로 했습니다.
(백엔드 API를 완전히 stateless하게 새로 만들면 좋겠지만, ~~코인은 벌어야~~ 소는 키워야죠)

이를 위해 [레일즈]의 세션 처리 과정을 분석하고 정리했습니다.

[레일즈]의 [actionpack의 `action_dispatch/middleware/cookie.rb`](https://github.com/rails/rails/blob/master/actionpack/lib/action_dispatch/middleware/cookies.rb)를 보면
`EncryptedCookieJar` 클래스의 초기화 과정은 다음과 같습니다(digest의 경우 따로 지정안하면 SHA1이 사용되는 듯):

```ruby
class EncryptedCookieJar < AbstractCookieJar # :nodoc:
      include SerializedCookieJars

      def initialize(parent_jar)
        super
        if ActiveSupport::LegacyKeyGenerator === key_generator
          raise "You didn't set secrets.secret_key_base, which is required for this cookie jar. " +
            "Read the upgrade documentation to learn more about this new config option."
        end
        secret = key_generator.generate_key(request.encrypted_cookie_salt || '')
        sign_secret = key_generator.generate_key(request.encrypted_signed_cookie_salt || '')
        @encryptor = ActiveSupport::MessageEncryptor.new(secret, sign_secret, digest: digest, serializer: ActiveSupport::MessageEncryptor::NullSerializer)
      end

      private
        def parse(name, encrypted_message)
          debugger
          deserialize name, @encryptor.decrypt_and_verify(encrypted_message)
        rescue ActiveSupport::MessageVerifier::InvalidSignature, ActiveSupport::MessageEncryptor::InvalidMessage
          nil
        end

        def commit(options)
          debugger
          options[:value] = @encryptor.encrypt_and_sign(serialize(options[:value]))

          raise CookieOverflow if options[:value].bytesize > MAX_COOKIE_SIZE
        end
    end
``` 

`key_generator`는 `EncryptedCookieJar`에 포함된 `SerializedCookieJars` 모듈에 정의되어 있습니다:

```ruby
module SerializedCookieJars
  # ...
  def key_generator
    request.key_generator
  end
end
```

흠... 좀 더 파보죠. `request.key_genrator`는 다음과 같습니다:

```ruby
class Request
  # ...
  def key_generator
    get_header Cookies::GENERATOR_KEY
  end
  #...
end
```
 
흠... 좀 더 파야할 듯 ㅠㅠ.`Cookies::GENERATOR_KEY`는 다음과 같습니다:

```ruby
class Cookies
  #...
  GENERATOR_KEY = "action_dispatch.key_generator".freeze
end
```

`action_dispatch.key_generator`는 [레일즈]의 엔진 모듈에 해당하는 [railties의 `application.rb`](https://github.com/rails/rails/blob/master/railties/lib/rails/application.rb)에 정의되어 있습니다:

```ruby
def key_generator
  # number of iterations selected based on consultation with the google security
  # team. Details at https://github.com/rails/rails/pull/6952#issuecomment-7661220
  @caching_key_generator ||=
    if secrets.secret_key_base
      unless secrets.secret_key_base.kind_of?(String)
        raise ArgumentError, "`secret_key_base` for #{Rails.env} environment must be a type of String, change this value in `config/secrets.yml`"
      end
      key_generator = ActiveSupport::KeyGenerator.new(secrets.secret_key_base, iterations: 1000)
      ActiveSupport::CachingKeyGenerator.new(key_generator)
    else
      ActiveSupport::LegacyKeyGenerator.new(secrets.secret_token)
    end
end
 
# ...

def env_config
  @app_env_config ||= begin
  validate_secret_key_config!

  super.merge(
    # ...
    "action_dispatch.key_generator" => key_generator,
    "action_dispatch.signed_cookie_salt" => config.action_dispatch.signed_cookie_salt,
    "action_dispatch.encrypted_cookie_salt" => config.action_dispatch.encrypted_cookie_salt,
    "action_dispatch.encrypted_signed_cookie_salt" => config.action_dispatch.encrypted_signed_cookie_salt,
    "action_dispatch.cookies_serializer" => config.action_dispatch.cookies_serializer,
    "action_dispatch.cookies_digest" => config.action_dispatch.cookies_digest
  )
  end
end
```

너무 깊이 판 느낌적느낌(?)이 있지만, 여기까지 왔으니 좀 더 파보겠습니다.

핵심 알고리즘은 [activesupport](https://github.com/rails/rails/blob/master/activesupport)의
[`key_generator.rb`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/key_generator.rb),
[`message_encryptor.rb`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/message_encryptor.rb),
[`message_verifier.rb`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/message_verifier.rb)에 정의되어 있습니다.


먼저, [`key_generator.rb`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/key_generator.rb)의 핵심은 다음과 같습니다:

```ruby
class KeyGenerator
    def initialize(secret, options = {})
      @secret = secret
      # The default iterations are higher than required for our key derivation uses
      # on the off chance someone uses this for password storage
      @iterations = options[:iterations] || 2**16
    end

    # Returns a derived key suitable for use.  The default key_size is chosen
    # to be compatible with the default settings of ActiveSupport::MessageVerifier.
    # i.e. OpenSSL::Digest::SHA1#block_length
    def generate_key(salt, key_size=64)
      OpenSSL::PKCS5.pbkdf2_hmac_sha1(@secret, salt, @iterations, key_size)
    end
end
```

계속해서, [`message_encryptor.rb`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/message_encryptor.rb)의 핵심은 다음과 같습니다:

```ruby
def initialize(secret, *signature_key_or_options)
      options = signature_key_or_options.extract_options!
      sign_secret = signature_key_or_options.first
      @secret = secret
      @sign_secret = sign_secret
      @cipher = options[:cipher] || 'aes-256-cbc'
      @verifier = MessageVerifier.new(@sign_secret || @secret, digest: options[:digest] || 'SHA1', serializer: NullSerializer)
      @serializer = options[:serializer] || Marshal
end
def _encrypt(value)
      cipher = new_cipher
      cipher.encrypt
      cipher.key = @secret

      # Rely on OpenSSL for the initialization vector
      iv = cipher.random_iv

      encrypted_data = cipher.update(@serializer.dump(value))
      encrypted_data << cipher.final

      "#{::Base64.strict_encode64 encrypted_data}--#{::Base64.strict_encode64 iv}"
end
def _decrypt(encrypted_message)
      cipher = new_cipher
      encrypted_data, iv = encrypted_message.split("--".freeze).map {|v| ::Base64.strict_decode64(v)}

      cipher.decrypt
      cipher.key = @secret
      cipher.iv  = iv

      decrypted_data = cipher.update(encrypted_data)
      decrypted_data << cipher.final

      @serializer.load(decrypted_data)
  rescue OpenSSLCipherError, TypeError, ArgumentError
      raise InvalidMessage
end
 
def encrypt_and_sign(value)
      verifier.generate(_encrypt(value))
end
 
def decrypt_and_verify(value)
      _decrypt(verifier.verify(value))
end
````

(Hopefully)마지막으로,
[`message_verifier.rb`](https://github.com/rails/rails/blob/master/activesupport/lib/active_support/message_verifier.rb)의 핵심은 다음과 같습니다:

```ruby
def initialize(secret, options = {})
      raise ArgumentError, 'Secret should not be nil.' unless secret
      @secret = secret
      @digest = options[:digest] || 'SHA1'
      @serializer = options[:serializer] || Marshal
end

def valid_message?(signed_message)
      return if signed_message.nil? || !signed_message.valid_encoding? || signed_message.blank?

      data, digest = signed_message.split("--".freeze)
      data.present? && digest.present? && ActiveSupport::SecurityUtils.secure_compare(digest, generate_digest(data))
end

def verified(signed_message)
      if valid_message?(signed_message)
        begin
          data = signed_message.split("--".freeze)[0]
          @serializer.load(decode(data))
        rescue ArgumentError => argument_error
          return if argument_error.message =~ %r{invalid base64}
          raise
        end
      end
end

def generate(value)
      data = encode(@serializer.dump(value))
      "#{data}--#{generate_digest(data)}"
end
 
private
      def encode(data)
        ::Base64.strict_encode64(data)
      end

      def decode(data)
        ::Base64.strict_decode64(data)
      end

      def generate_digest(data)
        require 'openssl' unless defined?(OpenSSL)
        OpenSSL::HMAC.hexdigest(OpenSSL::Digest.const_get(@digest).new, @secret, data)
      end
# ...
# encode, decode는 base64사용
```

이제 [레일즈]가 쿠키 기반의 세션을 어떻게 처리하는지 조금 눈에 들어옵니다.
그러나 우리의 최종 목표는 [레일즈]의 내부를 공부하는 것이 아니라, 자바에서 동일한 처리를 하는 것입니다.
모듈 의존성 따위는 가볍게 무시하고 무한복붙(?)을 시전해서, **레일즈의 세션 처리 과정을 눈으로 확인할 수 있도록 재구성**했습니다:


```ruby
require 'openssl'
require 'base64'
require 'concurrent/map'

class Object
  def blank?
    respond_to?(:empty?) ? !!empty? : !self
  end

  def present?
    !blank?
  end
end

class Hash
  # By default, only instances of Hash itself are extractable.
  # Subclasses of Hash may implement this method and return
  # true to declare themselves as extractable. If a Hash
  # is extractable, Array#extract_options! pops it from
  # the Array when it is the last element of the Array.
  def extractable_options?
    instance_of?(Hash)
  end
end

class Array
  def extract_options!
    if last.is_a?(Hash) && last.extractable_options?
      pop
    else
      {}
    end
  end
end

module SecurityUtils
  def secure_compare(a, b)
    return false unless a.bytesize == b.bytesize

    l = a.unpack "C#{a.bytesize}"

    res = 0
    b.each_byte { |byte| res |= byte ^ l.shift }
    res == 0
  end
  module_function :secure_compare
end

class KeyGenerator
  def initialize(secret, options = {})
    @secret = secret
    # The default iterations are higher than required for our key derivation uses
    # on the off chance someone uses this for password storage
    @iterations = options[:iterations] || 2**16
  end

  def generate_key(salt, key_size=64)
    OpenSSL::PKCS5.pbkdf2_hmac_sha1(@secret, salt, @iterations, key_size)
  end
end

class CachingKeyGenerator
  def initialize(key_generator)
    @key_generator = key_generator
    @cache_keys = Concurrent::Map.new
  end

  # Returns a derived key suitable for use.
  def generate_key(*args)
    @cache_keys[args.join] ||= @key_generator.generate_key(*args)
  end
end

class MessageVerifier
  class InvalidSignature < StandardError; end

  def initialize(secret, options = {})
    raise ArgumentError, 'Secret should not be nil.' unless secret
    @secret = secret
    @digest = options[:digest] || 'SHA1'
    @serializer = options[:serializer] || Marshal
  end

  def valid_message?(signed_message)
    return if signed_message.nil? || !signed_message.valid_encoding? || signed_message.blank?

    data, digest = signed_message.split("--".freeze)
    data.present? && digest.present? && SecurityUtils.secure_compare(digest, generate_digest(data))
  end

  def verified(signed_message)
    if valid_message?(signed_message)
      begin
        data = signed_message.split("--".freeze)[0]
        @serializer.load(decode(data))
      rescue ArgumentError => argument_error
        return if argument_error.message =~ %r{invalid base64}
        raise
      end
    end
  end

  def verify(signed_message)
    verified(signed_message) || raise(InvalidSignature)
  end
  
  def generate(value)
    data = encode(@serializer.dump(value))
    "#{data}--#{generate_digest(data)}"
  end

  private
    def encode(data)
      ::Base64.strict_encode64(data)
    end

    def decode(data)
      ::Base64.strict_decode64(data)
    end

    def generate_digest(data)
      require 'openssl' unless defined?(OpenSSL)
      OpenSSL::HMAC.hexdigest(OpenSSL::Digest.const_get(@digest).new, @secret, data)
    end
end

class MessageEncryptor
  module NullSerializer #:nodoc:
    def self.load(value)
      value
    end

    def self.dump(value)
      value
    end
  end

  class InvalidMessage < StandardError; end
  OpenSSLCipherError = OpenSSL::Cipher::CipherError

  def initialize(secret, *signature_key_or_options)
    options = signature_key_or_options.extract_options!
    sign_secret = signature_key_or_options.first
    @secret = secret
    @sign_secret = sign_secret
    @cipher = options[:cipher] || 'aes-256-cbc'
    @verifier = MessageVerifier.new(@sign_secret || @secret, digest: options[:digest] || 'SHA1', serializer: NullSerializer)
    @serializer = options[:serializer] || Marshal
  end

  def encrypt_and_sign(value)
    verifier.generate(_encrypt(value))
  end

  def decrypt_and_verify(value)
    _decrypt(verifier.verify(value))
  end

  def _encrypt(value)
    cipher = new_cipher
    cipher.encrypt
    cipher.key = @secret

    # Rely on OpenSSL for the initialization vector
    iv = cipher.random_iv

    encrypted_data = cipher.update(@serializer.dump(value))
    encrypted_data << cipher.final

    "#{::Base64.strict_encode64 encrypted_data}--#{::Base64.strict_encode64 iv}"
  end

  def _decrypt(encrypted_message)
    cipher = new_cipher
    encrypted_data, iv = encrypted_message.split("--".freeze).map {|v| ::Base64.strict_decode64(v)}

    cipher.decrypt
    cipher.key = @secret
    cipher.iv  = iv

    decrypted_data = cipher.update(encrypted_data)
    decrypted_data << cipher.final

    @serializer.load(decrypted_data)
  rescue OpenSSLCipherError, TypeError, ArgumentError
    raise InvalidMessage
  end

  def new_cipher
    OpenSSL::Cipher.new(@cipher)
  end

  def verifier
    @verifier
  end
end

#key generate
encrypted_cookie_salt = 'encrypted cookie'
encrypted_signed_cookie_salt = 'signed encrypted cookie'

def key_generator
  secret_key_base = 'db1c366b854c235f98fc3dd356ad6be8dd388f82ad1ddf14dcad9397ddfdb759b4a9fb33385f695f2cc335041eed0fae74eb669c9fb0c40cafdb118d881215a9'
  key_generator = KeyGenerator.new(secret_key_base, iterations: 1000)
  CachingKeyGenerator.new(key_generator)
end

# encrypt
secret = key_generator.generate_key(encrypted_cookie_salt || '')
sign_secret = key_generator.generate_key(encrypted_signed_cookie_salt || '')
encryptor = MessageEncryptor.new(secret, sign_secret, digest: 'SHA1', serializer: MessageEncryptor::NullSerializer)

value = "{\"session_id\":\"6022d05887d2ab9c1bad8a87cf8fb949\",\"_csrf_token\":\"OPv/LxbiA5dUjVsbG4EllSS9cca630WOHQcMtPxSQUE=\"}"

encrypted_message = encryptor.encrypt_and_sign(value)
#encrypted_message = encryptor._encrypt(value)

p '-----------encrypted value-------------'
p encrypted_message

# decrypt
encrypted_message = 'bDhIQncxc2k0Rm9QS0VBT0hWc3M4b2xoSnJDdkZNc1B0bGQ2YUhhRXl6SU1oa2c5cTNENWhmR0ZUWC9zN05mamhEYkFJREJLaDQ3SnM3NVNEbFF3ZVdiaFd5YXdlblM5SmZja0R4TE9JbDNmOVlENHhOVFlnamNVS2g1a05LY0FYV3BmUmRPRWtVNUdxYTJVbG5VVUlRPT0tLXd1akRqOU1lTTVneU9LTWszY0I5bFE9PQ==--b0a57266c00e76e0c7d9d855b25d24b242154070'

p '-----------decypted value-------------'
puts encryptor.decrypt_and_verify encrypted_message
p '---------------------------------------'
```

이 과정을 자바로 구현한 소스는 ~~생략~~ [**깃헙**](https://github.com/odyss009/rails-session-cookie-for-java)에 올려두었습니다.
이 코드를 이용해서 서블릿 세션과 연동하는 방법은 추후 사측(?)과 협의되는 대로 공유할 예정입니다.
물론, 그 전에 쿠키를 공유할 필요가 없어지면(or 공유할 쿠키가 없어지면) 더 좋겠죠 :D

[레일즈]:http://rubyonrails.org/
[Flexible Environment]:https://cloud.google.com/appengine/docs/flexible/
[Standard Environment]:https://cloud.google.com/appengine/docs/standard/
